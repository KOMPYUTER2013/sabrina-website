import logging
import os

import httpx
from dotenv import load_dotenv
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

load_dotenv()
logging.basicConfig(
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
CHAT_ID = os.getenv("CHAT_ID", "").strip()
SITE_API_URL = os.getenv("SITE_API_URL", "").strip().rstrip("/")
ADMIN_API_TOKEN = os.getenv("ADMIN_API_TOKEN", "").strip()
ADMIN_TELEGRAM_IDS = {
    value.strip()
    for value in os.getenv("ADMIN_TELEGRAM_IDS", "").split(",")
    if value.strip()
}
API_ENDPOINT = f"{SITE_API_URL}/.netlify/functions/admin"
MAX_TEXT_LENGTH = 3500


def is_admin(update: Update) -> bool:
    user = update.effective_user
    chat = update.effective_chat
    return bool(
        user
        and chat
        and chat.type == "private"
        and str(user.id) in ADMIN_TELEGRAM_IDS
    )


async def api_request(
    context: ContextTypes.DEFAULT_TYPE,
    method: str,
    *,
    params: dict | None = None,
    payload: dict | None = None,
) -> dict:
    client: httpx.AsyncClient = context.application.bot_data["http"]
    response = await client.request(
        method,
        API_ENDPOINT,
        params=params,
        json=payload,
        headers={"Authorization": f"Bearer {ADMIN_API_TOKEN}"},
    )
    response.raise_for_status()
    return response.json()


async def show_admin_menu(
    update: Update, context: ContextTypes.DEFAULT_TYPE, chat_id: int | None = None
) -> None:
    data = await api_request(context, "GET", params={"resource": "fields"})
    sections = data["sections"]
    keyboard = [
        [InlineKeyboardButton(f"✏️ {section['title']}", callback_data=f"section:{index}")]
        for index, section in enumerate(sections)
    ]
    keyboard.append(
        [InlineKeyboardButton("📊 Tashriflar statistikasi", callback_data="stats")]
    )
    await context.bot.send_message(
        chat_id=chat_id or update.effective_chat.id,
        text="Admin panel. Boʻlimni tanlang yoki tashriflar statistikasini oching.",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if is_admin(update):
        await show_admin_menu(update, context)
        return
    await update.effective_message.reply_text(
        "Salom! Darslar haqida savolingizni yozib qoldiring."
    )


async def admin(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_admin(update):
        await update.effective_message.reply_text("Bu buyruq admin uchun.")
        return
    await show_admin_menu(update, context)


async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_admin(update):
        await update.effective_message.reply_text("Bu buyruq admin uchun.")
        return
    result = await api_request(context, "GET", params={"resource": "stats"})
    await update.effective_message.reply_text(format_stats(result))


def format_stats(result: dict) -> str:
    days = result["daily"]
    peak = max((day["count"] for day in days), default=0) or 1
    lines = [
        "📊 Sayt statistikasi",
        f"🟢 Hozir onlayn: {result['online']} (oxirgi 5 daqiqada faol)",
        f"👥 Jami kirgan: {result['totalVisitors']} ta noyob brauzer",
        "",
        "Oxirgi 30 kun · kunlik noyob tashriflar",
    ]
    for day in days:
        count = day["count"]
        bar = "█" * max(1, round(count / peak * 18)) if count else "·"
        lines.append(f"{day['date'][5:]}  {bar} {count}")
    lines.append(
        "\nHisob anonim brauzer ID asosida; brauzer maʼlumotlari oʻchirilsa, qayta sanaladi."
    )
    return "\n".join(lines)


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not is_admin(update):
        await update.effective_message.reply_text("Bu buyruq admin uchun.")
        return
    context.user_data.pop("pending_path", None)
    await update.effective_message.reply_text("Tahrirlash bekor qilindi.")


async def callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    if not is_admin(update):
        await query.answer("Ruxsat yoʻq.", show_alert=True)
        return

    await query.answer()
    if query.data == "stats":
        result = await api_request(context, "GET", params={"resource": "stats"})
        await query.message.reply_text(format_stats(result))
        return

    data = await api_request(context, "GET", params={"resource": "fields"})
    sections = data["sections"]
    if query.data == "menu":
        await show_admin_menu(update, context)
        return

    if query.data.startswith("section:"):
        try:
            index = int(query.data.split(":", 1)[1])
            section = sections[index]
        except (ValueError, IndexError):
            await query.message.reply_text("Boʻlim topilmadi.")
            return

        keyboard = [
            [InlineKeyboardButton(field["label"], callback_data=f"edit:{field['path']}")]
            for field in section["fields"]
        ]
        keyboard.append(
            [InlineKeyboardButton("⬅️ Boʻlimlar", callback_data="menu")]
        )
        await query.message.reply_text(
            f"{section['title']}: qaysi matnni tahrirlaymiz?",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )
        return

    if query.data.startswith("edit:"):
        path = query.data.split(":", 1)[1]
        field = next(
            (
                item
                for section in sections
                for item in section["fields"]
                if item["path"] == path
            ),
            None,
        )
        if not field:
            await query.message.reply_text("Maydon topilmadi.")
            return
        context.user_data["pending_path"] = path
        content = await api_request(context, "GET", params={"resource": "content"})
        value = get_value(content, path)
        await query.message.reply_text(
            f"✏️ {field['label']}\n\nHozirgi matn:\n{value}\n\n"
            "Yangi matnni bitta xabar qilib yuboring. Bekor qilish: /cancel"
        )


def get_value(content: dict, path: str):
    value = content
    for key in path.split("."):
        value = value[int(key)] if isinstance(value, list) else value[key]
    return value


async def text_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.effective_message
    if is_admin(update):
        path = context.user_data.get("pending_path")
        if not path:
            await message.reply_text("Admin panel: /admin\nStatistika: /stats")
            return
        if not message.text or len(message.text) > MAX_TEXT_LENGTH:
            await message.reply_text("Matn boʻsh yoki juda uzun. 3500 belgigacha yuboring.")
            return

        await api_request(
            context,
            "POST",
            payload={"path": path, "value": message.text},
        )
        context.user_data.pop("pending_path", None)
        await message.reply_text("✅ Matn saqlandi.")
        await show_admin_menu(update, context)
        return

    sender = update.effective_user
    name = " ".join(
        part for part in (sender.first_name, sender.last_name) if part
    ) or "Nomaʼlum foydalanuvchi"
    username = f"@{sender.username}" if sender.username else "username yoʻq"
    await context.bot.send_message(
        chat_id=CHAT_ID,
        text=(
            "Botga yangi xabar\n"
            f"Ism: {name}\n"
            f"Username: {username}\n"
            f"Telegram ID: {sender.id}\n\n"
            f"{message.text}"
        ),
    )
    await message.reply_text(
        "Xabaringiz Sabrina ustozga yetkazildi. Tez orada javob beriladi."
    )


async def post_init(application: Application) -> None:
    application.bot_data["http"] = httpx.AsyncClient(timeout=15)
    await application.bot.delete_webhook(drop_pending_updates=False)


async def post_shutdown(application: Application) -> None:
    await application.bot_data["http"].aclose()


def main() -> None:
    required = {
        "BOT_TOKEN": BOT_TOKEN,
        "CHAT_ID": CHAT_ID,
        "SITE_API_URL": SITE_API_URL,
        "ADMIN_API_TOKEN": ADMIN_API_TOKEN,
        "ADMIN_TELEGRAM_IDS": ",".join(ADMIN_TELEGRAM_IDS),
    }
    missing = [key for key, value in required.items() if not value]
    if missing:
        raise SystemExit(f"Quyidagi environment variable’larni sozlang: {', '.join(missing)}")
    if len(ADMIN_TELEGRAM_IDS) != 2 or not all(
        admin_id.isdigit() for admin_id in ADMIN_TELEGRAM_IDS
    ):
        raise SystemExit(
            "ADMIN_TELEGRAM_IDS vergul bilan ajratilgan ikkita raqamli Telegram ID boʻlishi kerak."
        )
    if not SITE_API_URL.startswith("https://"):
        raise SystemExit("SITE_API_URL HTTPS manzil boʻlishi kerak.")

    application = (
        Application.builder()
        .token(BOT_TOKEN)
        .post_init(post_init)
        .post_shutdown(post_shutdown)
        .build()
    )
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("admin", admin))
    application.add_handler(CommandHandler("stats", stats))
    application.add_handler(CommandHandler("cancel", cancel))
    application.add_handler(CallbackQueryHandler(callback))
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, text_message)
    )
    application.run_polling()


if __name__ == "__main__":
    main()
