import type { Localized } from "@/lib/types";

/**
 * Наполнение второстепенных страниц из бокового меню.
 *
 * Демонстрационный контент: тексты написаны для показа заказчику
 * и подлежат замене на фактические данные заведения.
 *
 * Исключение — оферта, юридическая информация, сертификаты и правила
 * возврата: там реквизиты, номера документов и даты оставлены
 * плейсхолдерами в квадратных скобках. Это официальные идентификаторы,
 * их нельзя придумывать даже для демонстрации.
 */

export type InfoBlock =
  | { type: "lead"; text: Localized }
  | { type: "paragraphs"; items: Localized[] }
  | { type: "list"; title?: Localized; items: Localized[] }
  | { type: "cards"; items: { title: Localized; text: Localized; meta?: Localized }[] }
  | { type: "faq"; items: { q: Localized; a: Localized }[] }
  | { type: "steps"; items: { title: Localized; text: Localized }[] }
  | { type: "note"; text: Localized };

export const INFO_CONTENT: Record<string, InfoBlock[]> = {
  /* ─────────────────────────── филиалы ─────────────────────────── */
  branches: [
    {
      type: "lead",
      text: {
        ru: "Готовим в одной кухне в центре Чирчика и развозим по всему городу. Второй адрес откроем, когда будем уверены, что качество не просядет.",
        uz: "Chirchiq markazidagi bitta oshxonada tayyorlaymiz va butun shahar boʻylab yetkazamiz. Ikkinchi manzilni sifat pasaymasligiga ishonch hosil qilgach ochamiz.",
      },
    },
    {
      type: "cards",
      items: [
        {
          title: { ru: "Мр. Суши на Амира Темура", uz: "Amir Temurdagi Mr. Sushi" },
          text: {
            ru: "Основная кухня и зал на 24 посадочных места. Здесь же забирают самовывоз — заказ ждёт на стойке у входа.",
            uz: "Asosiy oshxona va 24 oʻrinli zal. Olib ketish shu yerda — buyurtma kiraverishdagi peshtaxtada kutadi.",
          },
          meta: { ru: "Амир Темур, 120 · 10:00–23:00 · 88 345 05 93", uz: "Amir Temur, 120 · 10:00–23:00 · 88 345 05 93" },
        },
        {
          title: { ru: "Точка выдачи в Юкори Чирчике", uz: "Yuqori Chirchiqdagi topshirish nuqtasi" },
          text: {
            ru: "Готовим на основной кухне, курьер привозит заказы к 12:00 и к 18:00. Оформляйте на сайте и выбирайте самовывоз с этой точки.",
            uz: "Asosiy oshxonada tayyorlaymiz, kuryer buyurtmalarni 12:00 va 18:00 ga olib keladi. Saytda rasmiylashtiring va shu nuqtadan olib ketishni tanlang.",
          },
          meta: { ru: "Открытие — весна 2027", uz: "Ochilish — 2027 bahor" },
        },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Доставка работает по всему Чирчику. Если ваш адрес за пределами зоны на карте — позвоните, обсудим индивидуально.",
        uz: "Yetkazib berish butun Chirchiq boʻylab ishlaydi. Manzilingiz xaritadagi hududdan tashqarida boʻlsa — qoʻngʻiroq qiling.",
      },
    },
  ],

  /* ─────────────────────────── вакансии ─────────────────────────── */
  jobs: [
    {
      type: "lead",
      text: {
        ru: "Растём и ищем людей, которым важно, как выглядит и на вкус то, что они отдают гостю. Опыт полезен, отношение к делу важнее.",
        uz: "Oʻsayapmiz va mehmonga beradigan taomining koʻrinishi va taʼmi muhim boʻlgan odamlarni qidiramiz. Tajriba foydali, ishga munosabat muhimroq.",
      },
    },
    {
      type: "cards",
      items: [
        {
          title: { ru: "Повар-сушист", uz: "Sushi oshpazi" },
          text: {
            ru: "Крутите роллы и собираете сеты. Нужен опыт от года и понимание, что рис — это половина результата. График 2/2 с 10:00 до 23:00.",
            uz: "Roll oʻraysiz va setlar yigʻasiz. Bir yildan ortiq tajriba va guruch natijaning yarmi ekanini tushunish kerak. 2/2 grafik, 10:00–23:00.",
          },
          meta: { ru: "от 6 000 000 сум", uz: "6 000 000 soʻmdan" },
        },
        {
          title: { ru: "Помощник повара", uz: "Oshpaz yordamchisi" },
          text: {
            ru: "Заготовки, нарезка, чистота на станции. Научим крутить — многие наши сушисты начинали отсюда. Опыт не требуется.",
            uz: "Tayyorgarlik, toʻgʻrash, stansiyada tozalik. Oʻrashni oʻrgatamiz — sushi oshpazlarimiz koʻpchiligi shu yerdan boshlagan. Tajriba shart emas.",
          },
          meta: { ru: "от 3 500 000 сум", uz: "3 500 000 soʻmdan" },
        },
        {
          title: { ru: "Курьер", uz: "Kuryer" },
          text: {
            ru: "Развозите заказы по Чирчику. Нужен свой транспорт и телефон с картами. Оплата за смену плюс за каждый доставленный заказ.",
            uz: "Chirchiq boʻylab buyurtmalarni yetkazasiz. Oʻz transporti va xaritali telefon kerak. Smena uchun toʻlov va har bir buyurtma uchun qoʻshimcha.",
          },
          meta: { ru: "от 4 000 000 сум", uz: "4 000 000 soʻmdan" },
        },
        {
          title: { ru: "Оператор заказов", uz: "Buyurtma operatori" },
          text: {
            ru: "Принимаете заказы по телефону и в директе, подтверждаете состав и адрес. Русский и узбекский — оба разговорные. График 5/2.",
            uz: "Telefon va direktda buyurtma qabul qilasiz, tarkib va manzilni tasdiqlaysiz. Rus va oʻzbek tillari — ikkalasi ham. 5/2 grafik.",
          },
          meta: { ru: "от 4 500 000 сум", uz: "4 500 000 soʻmdan" },
        },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Отправляйте пару слов о себе на 88 345 05 93 в Телеграм или приходите на Амира Темура, 120 с 12:00 до 17:00.",
        uz: "Oʻzingiz haqingizda bir-ikki soʻzni 88 345 05 93 raqamiga Telegramda yuboring yoki Amir Temur 120 ga 12:00–17:00 da keling.",
      },
    },
  ],

  /* ──────────────────────────── акции ──────────────────────────── */
  promos: [
    {
      type: "lead",
      text: {
        ru: "Скидки, которые действуют всегда. Промокод вводится в корзине перед оформлением, скидки не суммируются между собой.",
        uz: "Doimiy amal qiladigan chegirmalar. Promokod savatda rasmiylashtirishdan oldin kiritiladi, chegirmalar bir-biriga qoʻshilmaydi.",
      },
    },
    {
      type: "cards",
      items: [
        {
          title: { ru: "PANDA10 — минус 10%", uz: "PANDA10 — 10% chegirma" },
          text: {
            ru: "На любой заказ от 100 000 сум. Работает и на доставку, и на самовывоз, без ограничений по времени.",
            uz: "100 000 soʻmdan ortiq har qanday buyurtmaga. Yetkazib berish va olib ketishda ishlaydi, vaqt cheklovisiz.",
          },
          meta: { ru: "от 100 000 сум", uz: "100 000 soʻmdan" },
        },
        {
          title: { ru: "CHIRCHIQ15 — минус 15%", uz: "CHIRCHIQ15 — 15% chegirma" },
          text: {
            ru: "На заказ от 200 000 сум. Обычно это сет на компанию или большой заказ в офис.",
            uz: "200 000 soʻmdan ortiq buyurtmaga. Odatda bu davra uchun set yoki ofisga katta buyurtma.",
          },
          meta: { ru: "от 200 000 сум", uz: "200 000 soʻmdan" },
        },
        {
          title: { ru: "INSTA20 — минус 20%", uz: "INSTA20 — 20% chegirma" },
          text: {
            ru: "Максимальная скидка на заказ от 300 000 сум. Для больших компаний и праздников.",
            uz: "300 000 soʻmdan ortiq buyurtmaga maksimal chegirma. Katta davralar va bayramlar uchun.",
          },
          meta: { ru: "от 300 000 сум", uz: "300 000 soʻmdan" },
        },
        {
          title: { ru: "Бесплатная доставка", uz: "Bepul yetkazib berish" },
          text: {
            ru: "От 150 000 сум везём бесплатно по всему Чирчику. Считается сумма после применения промокода.",
            uz: "150 000 soʻmdan butun Chirchiq boʻylab bepul yetkazamiz. Promokod qoʻllangandan keyingi summa hisoblanadi.",
          },
          meta: { ru: "действует всегда", uz: "doim amal qiladi" },
        },
        {
          title: { ru: "Бонусы за регистрацию", uz: "Roʻyxatdan oʻtish uchun bonus" },
          text: {
            ru: "10 000 бонусов сразу после создания аккаунта и 3% от каждого следующего заказа. Бонусами оплачивается часть счёта.",
            uz: "Hisob yaratgandan keyin darhol 10 000 bonus va har bir keyingi buyurtmadan 3%. Bonuslar bilan hisobning bir qismi toʻlanadi.",
          },
          meta: { ru: "для зарегистрированных", uz: "roʻyxatdan oʻtganlarga" },
        },
      ],
    },
  ],

  /* ─────────────────────────── новости ─────────────────────────── */
  news: [
    {
      type: "cards",
      items: [
        {
          title: { ru: "Салаты в меню", uz: "Menyuda salatlar" },
          text: {
            ru: "Добавили пять салатов: цезарь с тигровой креветкой, тёплый с курицей, греческий, с говядиной и рукколой и с ананасом. Всё собирается перед выездом курьера.",
            uz: "Beshta salat qoʻshdik: yoʻlbars krevetkali sezar, tovuqli issiq, grek, mol goʻshti va rukkolali hamda ananasli. Hammasi kuryer chiqishidan oldin yigʻiladi.",
          },
          meta: { ru: "Август 2026", uz: "2026 avgust" },
        },
        {
          title: { ru: "Сайт с онлайн-заказом", uz: "Onlayn buyurtmali sayt" },
          text: {
            ru: "Раньше заказы шли только через директ и звонки. Теперь можно собрать корзину на сайте — состав и адрес подтверждаем звонком за пять минут.",
            uz: "Ilgari buyurtmalar faqat direkt va qoʻngʻiroqlar orqali kelardi. Endi saytda savat yigʻish mumkin — tarkib va manzilni besh daqiqada qoʻngʻiroq bilan tasdiqlaymiz.",
          },
          meta: { ru: "Август 2026", uz: "2026 avgust" },
        },
        {
          title: { ru: "Летние напитки", uz: "Yozgi ichimliklar" },
          text: {
            ru: "Мохито, ягодный пунш и матча латте. Готовим на месте, лёд свой — вода проходит фильтрацию на кухне.",
            uz: "Mohito, rezavor punsh va matcha latte. Joyida tayyorlaymiz, muz oʻzimizniki — suv oshxonada filtrlanadi.",
          },
          meta: { ru: "Июль 2026", uz: "2026 iyul" },
        },
        {
          title: { ru: "Термо-упаковка", uz: "Termo qadoq" },
          text: {
            ru: "Перешли на раздельную упаковку: горячее и холодное едут в разных отсеках сумки. Запечённые роллы теперь доезжают тёплыми.",
            uz: "Alohida qadoqlashga oʻtdik: issiq va sovuq sumkaning turli boʻlimlarida boradi. Pishirilgan rollar endi iliq yetib boradi.",
          },
          meta: { ru: "Июнь 2026", uz: "2026 iyun" },
        },
      ],
    },
  ],

  /* ─────────────────────────── рецепты ─────────────────────────── */
  recipes: [
    {
      type: "lead",
      text: {
        ru: "Делимся тем, что делаем сами. Дома получится не хуже, если не торопиться на этапе риса.",
        uz: "Oʻzimiz qiladigan narsani baham koʻramiz. Guruch bosqichida shoshilmasangiz, uyda ham yomon chiqmaydi.",
      },
    },
    {
      type: "cards",
      items: [
        {
          title: { ru: "Рис для роллов", uz: "Rollar uchun guruch" },
          text: {
            ru: "Промывайте до прозрачной воды, минимум семь раз. Варите 12 минут под крышкой, снимите и дайте постоять ещё 10 не открывая. Заправка: на 500 г риса — 60 мл рисового уксуса, 30 г сахара, 10 г соли, подогреть не кипятя. Мешать лопаткой на разрез, а не перемешивать.",
            uz: "Suv tiniq boʻlguncha yuving, kamida yetti marta. Qopqoq ostida 12 daqiqa pishiring, olib qoʻying va ochmasdan yana 10 daqiqa turing. Sous: 500 g guruchga 60 ml guruch sirkasi, 30 g shakar, 10 g tuz, qaynatmasdan isiting. Aralashtirmasdan, kurakcha bilan kesib aralashtiring.",
          },
          meta: { ru: "База для всего", uz: "Hamma narsa uchun asos" },
        },
        {
          title: { ru: "Спайси-соус", uz: "Spicy sous" },
          text: {
            ru: "Японский майонез, паста кимчи и капля кунжутного масла в пропорции 4:1:0,2. Настоять полчаса в холодильнике — острота раскроется. Хранится трое суток.",
            uz: "Yapon mayonezi, kimchi pastasi va bir tomchi kunjut moyi 4:1:0,2 nisbatda. Muzlatgichda yarim soat tindiring — achchiqlik ochiladi. Uch kun saqlanadi.",
          },
          meta: { ru: "5 минут", uz: "5 daqiqa" },
        },
        {
          title: { ru: "Унаги-соус", uz: "Unagi sous" },
          text: {
            ru: "Соевый соус, мирин и сахар в равных частях, уварить на медленном огне до трети объёма. Готовность — когда стекает с ложки лентой, а не каплями.",
            uz: "Soya sousi, mirin va shakar teng miqdorda, sekin olovda hajmning uchdan biriga qadar qaynating. Tayyorlik — qoshiqdan tomchilab emas, lenta boʻlib oqsa.",
          },
          meta: { ru: "20 минут", uz: "20 daqiqa" },
        },
      ],
    },
  ],

  /* ────────────────── условия доставки и оплаты ────────────────── */
  terms: [
    {
      type: "lead",
      text: {
        ru: "Везём по всему Чирчику своими курьерами — заказы не отдаём агрегаторам, поэтому отвечаем за то, в каком виде еда доедет.",
        uz: "Butun Chirchiq boʻylab oʻz kuryerlarimiz bilan yetkazamiz — buyurtmalarni agregatorlarga bermaymiz, shuning uchun taom qanday yetib borishi uchun javob beramiz.",
      },
    },
    {
      type: "steps",
      items: [
        {
          title: { ru: "Оформление", uz: "Rasmiylashtirish" },
          text: {
            ru: "Соберите корзину на сайте, укажите адрес на карте и выберите время. Минимальная сумма заказа на доставку — 70 000 сум.",
            uz: "Saytda savat yigʻing, xaritada manzilni koʻrsating va vaqtni tanlang. Yetkazib berish uchun minimal buyurtma — 70 000 soʻm.",
          },
        },
        {
          title: { ru: "Подтверждение", uz: "Tasdiqlash" },
          text: {
            ru: "Оператор перезванивает в течение пяти минут, сверяет состав и адрес. Если не дозвонимся дважды — заказ отменяется.",
            uz: "Operator besh daqiqa ichida qoʻngʻiroq qiladi, tarkib va manzilni tekshiradi. Ikki marta bogʻlana olmasak — buyurtma bekor qilinadi.",
          },
        },
        {
          title: { ru: "Приготовление", uz: "Tayyorlash" },
          text: {
            ru: "Кухня собирает заказ 20–25 минут. Роллы крутим после подтверждения, впрок ничего не лежит.",
            uz: "Oshxona buyurtmani 20–25 daqiqada yigʻadi. Rollarni tasdiqdan keyin oʻraymiz, zaxiraga hech narsa yotmaydi.",
          },
        },
        {
          title: { ru: "Доставка", uz: "Yetkazib berish" },
          text: {
            ru: "40 минут по городу с момента подтверждения. Курьер звонит за пять минут до приезда, ждёт у подъезда до 10 минут.",
            uz: "Tasdiqlangandan 40 daqiqa shahar boʻylab. Kuryer kelishidan besh daqiqa oldin qoʻngʻiroq qiladi, podyezd oldida 10 daqiqagacha kutadi.",
          },
        },
      ],
    },
    {
      type: "list",
      title: { ru: "Стоимость доставки", uz: "Yetkazib berish narxi" },
      items: [
        { ru: "По Чирчику — 15 000 сум", uz: "Chirchiq boʻylab — 15 000 soʻm" },
        { ru: "От 150 000 сум — бесплатно", uz: "150 000 soʻmdan — bepul" },
        { ru: "Самовывоз с Амира Темура, 120 — бесплатно", uz: "Amir Temur 120 dan olib ketish — bepul" },
        {
          ru: "За пределы зоны на карте — по договорённости с оператором",
          uz: "Xaritadagi hududdan tashqariga — operator bilan kelishuv boʻyicha",
        },
      ],
    },
    {
      type: "list",
      title: { ru: "Способы оплаты", uz: "Toʻlov usullari" },
      items: [
        { ru: "Наличными курьеру при получении", uz: "Olayotganda kuryerga naqd" },
        { ru: "Картой курьеру — терминал с собой", uz: "Kuryerga karta — terminal oʻzida" },
        { ru: "Click и Payme — ссылка приходит после подтверждения", uz: "Click va Payme — tasdiqdan keyin havola keladi" },
        { ru: "Бонусами — списываются в корзине", uz: "Bonuslar bilan — savatda yechiladi" },
      ],
    },
    {
      type: "faq",
      items: [
        {
          q: { ru: "Можно заказать на определённое время?", uz: "Belgilangan vaqtga buyurtma berish mumkinmi?" },
          a: {
            ru: "Да, выберите слот при оформлении. Принимаем предзаказы на тот же день до 22:00.",
            uz: "Ha, rasmiylashtirishda vaqtni tanlang. Oʻsha kunga 22:00 gacha oldindan buyurtma qabul qilamiz.",
          },
        },
        {
          q: { ru: "Что, если чего-то не окажется?", uz: "Agar biror narsa boʻlmasa?" },
          a: {
            ru: "Сайт показывает остатки в реальном времени, но если позицию разберут между заказом и подтверждением — оператор предложит замену или пересчитает сумму.",
            uz: "Sayt qoldiqlarni real vaqtda koʻrsatadi, lekin taom buyurtma va tasdiq orasida tugasa — operator almashtirish taklif qiladi yoki summani qayta hisoblaydi.",
          },
        },
        {
          q: { ru: "Везёте в офис на большую компанию?", uz: "Katta davra uchun ofisga olib borasizmi?" },
          a: {
            ru: "Да. На заказы от 500 000 сум лучше предупредить за два часа — кухня спланирует загрузку.",
            uz: "Ha. 500 000 soʻmdan ortiq buyurtmalar uchun ikki soat oldin ogohlantiring — oshxona yuklamani rejalashtiradi.",
          },
        },
      ],
    },
  ],

  /* ────────────────────── правила посещения ────────────────────── */
  rules: [
    {
      type: "lead",
      text: {
        ru: "В зале 24 места. Мы за то, чтобы гостям было спокойно, поэтому просим о нескольких простых вещах.",
        uz: "Zalda 24 oʻrin bor. Mehmonlarga tinch boʻlishini istaymiz, shuning uchun bir nechta oddiy narsani soʻraymiz.",
      },
    },
    {
      type: "list",
      title: { ru: "Бронь стола", uz: "Stol broni" },
      items: [
        { ru: "Бронируем на сайте или по телефону 88 345 05 93", uz: "Saytda yoki 88 345 05 93 orqali bron qilamiz" },
        { ru: "Держим стол 20 минут от забронированного времени", uz: "Stolni bron vaqtidan 20 daqiqa ushlab turamiz" },
        { ru: "Компании от 8 человек — предупреждайте за день", uz: "8 kishidan koʻp davra — bir kun oldin ogohlantiring" },
      ],
    },
    {
      type: "list",
      title: { ru: "В зале", uz: "Zalda" },
      items: [
        { ru: "Со своими едой и напитками нельзя", uz: "Oʻz taom va ichimliklaringiz bilan mumkin emas" },
        { ru: "Курение, включая электронные сигареты, только на улице", uz: "Chekish, elektron sigaretalar ham, faqat koʻchada" },
        { ru: "Детей до 12 лет просим не оставлять без присмотра", uz: "12 yoshgacha bolalarni nazoratsiz qoldirmang" },
        { ru: "С животными — только на летнюю террасу", uz: "Hayvonlar bilan — faqat yozgi terrasaga" },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Если что-то пошло не так — скажите администратору сразу, а не в отзыве через неделю. Почти всё решается на месте.",
        uz: "Nimadir notoʻgʻri ketsa — bir haftadan keyin sharhda emas, darhol administratorga ayting. Deyarli hammasi joyida hal boʻladi.",
      },
    },
  ],

  /* ───────────────────── публичная оферта ───────────────────── */
  offer: [
    {
      type: "lead",
      text: {
        ru: "Настоящий документ является публичной офертой — предложением заключить договор возмездного оказания услуг общественного питания и доставки на изложенных ниже условиях.",
        uz: "Ushbu hujjat ommaviy oferta — quyida bayon etilgan shartlarda umumiy ovqatlanish va yetkazib berish xizmatlarini koʻrsatish shartnomasini tuzish taklifidir.",
      },
    },
    {
      type: "list",
      title: { ru: "1. Стороны", uz: "1. Tomonlar" },
      items: [
        {
          ru: "Исполнитель — [полное наименование юридического лица], действующее на основании [документ].",
          uz: "Ijrochi — [yuridik shaxsning toʻliq nomi], [hujjat] asosida ish yuritadi.",
        },
        {
          ru: "Заказчик — физическое лицо, оформившее заказ на сайте, по телефону или в мессенджере.",
          uz: "Buyurtmachi — saytda, telefon yoki messenjerda buyurtma bergan jismoniy shaxs.",
        },
      ],
    },
    {
      type: "list",
      title: { ru: "2. Предмет договора", uz: "2. Shartnoma predmeti" },
      items: [
        {
          ru: "Исполнитель обязуется приготовить и передать Заказчику блюда из меню, а при выборе доставки — доставить их по указанному адресу.",
          uz: "Ijrochi menyudagi taomlarni tayyorlab Buyurtmachiga topshirishni, yetkazib berish tanlanganda esa koʻrsatilgan manzilga yetkazishni oʻz zimmasiga oladi.",
        },
        {
          ru: "Заказчик обязуется принять и оплатить заказ в соответствии с условиями настоящей оферты.",
          uz: "Buyurtmachi buyurtmani qabul qilish va ushbu oferta shartlariga muvofiq toʻlashni oʻz zimmasiga oladi.",
        },
      ],
    },
    {
      type: "list",
      title: { ru: "3. Оформление и акцепт", uz: "3. Rasmiylashtirish va aksept" },
      items: [
        {
          ru: "Акцептом оферты считается оформление заказа и его подтверждение Заказчиком по телефону.",
          uz: "Ofertaning aksepti — buyurtmani rasmiylashtirish va uni Buyurtmachi tomonidan telefon orqali tasdiqlash.",
        },
        {
          ru: "С момента акцепта договор считается заключённым на условиях настоящей оферты.",
          uz: "Aksept lahzasidan shartnoma ushbu oferta shartlarida tuzilgan hisoblanadi.",
        },
        {
          ru: "Цены и состав блюд указаны на сайте и действительны на момент оформления заказа.",
          uz: "Narxlar va taom tarkibi saytda koʻrsatilgan va buyurtma rasmiylashtirilgan paytda amal qiladi.",
        },
      ],
    },
    {
      type: "list",
      title: { ru: "4. Оплата", uz: "4. Toʻlov" },
      items: [
        { ru: "Оплата производится наличными, банковской картой или через платёжные сервисы Click и Payme.", uz: "Toʻlov naqd, bank kartasi yoki Click va Payme toʻlov xizmatlari orqali amalga oshiriladi." },
        { ru: "Стоимость доставки включается в итоговую сумму заказа и отображается до оплаты.", uz: "Yetkazib berish narxi buyurtmaning yakuniy summasiga kiritiladi va toʻlovdan oldin koʻrsatiladi." },
      ],
    },
    {
      type: "list",
      title: { ru: "5. Ответственность", uz: "5. Javobgarlik" },
      items: [
        {
          ru: "Исполнитель отвечает за качество и безопасность блюд в пределах, установленных законодательством Республики Узбекистан.",
          uz: "Ijrochi Oʻzbekiston Respublikasi qonunchiligida belgilangan doirada taomlarning sifati va xavfsizligi uchun javob beradi.",
        },
        {
          ru: "Исполнитель не несёт ответственности за задержку доставки, вызванную обстоятельствами непреодолимой силы, а также предоставлением Заказчиком неверного адреса или недоступностью для связи.",
          uz: "Ijrochi yengib boʻlmas kuch holatlari, shuningdek Buyurtmachi notoʻgʻri manzil berishi yoki bogʻlanib boʻlmasligi tufayli yetkazishning kechikishi uchun javob bermaydi.",
        },
      ],
    },
    {
      type: "list",
      title: { ru: "6. Реквизиты", uz: "6. Rekvizitlar" },
      items: [
        { ru: "Наименование: [полное наименование]", uz: "Nomi: [toʻliq nom]" },
        { ru: "ИНН: [номер]", uz: "STIR: [raqam]" },
        { ru: "Адрес: Чирчик, Амир Темур, 120", uz: "Manzil: Chirchiq, Amir Temur, 120" },
        { ru: "Телефон: 88 345 05 93", uz: "Telefon: 88 345 05 93" },
        { ru: "Редакция от: [дата]", uz: "Tahrir sanasi: [sana]" },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Реквизиты, регистрационные данные и дату редакции заполняет заведение — эти сведения являются официальными и не могут быть указаны произвольно.",
        uz: "Rekvizitlar, roʻyxatga olish maʼlumotlari va tahrir sanasini muassasa toʻldiradi — bu maʼlumotlar rasmiy va ixtiyoriy koʻrsatilmaydi.",
      },
    },
  ],

  /* ──────────────────── юридическая информация ──────────────────── */
  legal: [
    {
      type: "lead",
      text: {
        ru: "Сведения об организации, оказывающей услуги общественного питания и доставки через настоящий сайт.",
        uz: "Ushbu sayt orqali umumiy ovqatlanish va yetkazib berish xizmatlarini koʻrsatuvchi tashkilot haqidagi maʼlumotlar.",
      },
    },
    {
      type: "list",
      title: { ru: "Реквизиты организации", uz: "Tashkilot rekvizitlari" },
      items: [
        { ru: "Полное наименование: [наименование]", uz: "Toʻliq nomi: [nom]" },
        { ru: "Форма собственности: [форма]", uz: "Mulkchilik shakli: [shakl]" },
        { ru: "ИНН: [номер]", uz: "STIR: [raqam]" },
        { ru: "Регистрационный номер: [номер]", uz: "Roʻyxatga olish raqami: [raqam]" },
        { ru: "Юридический адрес: [адрес]", uz: "Yuridik manzil: [manzil]" },
        { ru: "Фактический адрес: Чирчик, Амир Темур, 120", uz: "Amaldagi manzil: Chirchiq, Amir Temur, 120" },
        { ru: "Банк: [наименование банка]", uz: "Bank: [bank nomi]" },
        { ru: "Расчётный счёт: [номер]", uz: "Hisob raqami: [raqam]" },
      ],
    },
    {
      type: "list",
      title: { ru: "Контакты для обращений", uz: "Murojaat uchun kontaktlar" },
      items: [
        { ru: "Телефон: 88 345 05 93, ежедневно 10:00–23:00", uz: "Telefon: 88 345 05 93, har kuni 10:00–23:00" },
        { ru: "Instagram: @mrsushi.uz", uz: "Instagram: @mrsushi.uz" },
        { ru: "Адрес для письменных обращений: Чирчик, Амир Темур, 120", uz: "Yozma murojaatlar uchun manzil: Chirchiq, Amir Temur, 120" },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Регистрационные данные и банковские реквизиты заполняет заведение. Это официальные идентификаторы организации — они не выдумываются и не берутся по образцу.",
        uz: "Roʻyxatga olish maʼlumotlari va bank rekvizitlarini muassasa toʻldiradi. Bu tashkilotning rasmiy identifikatorlari — ular oʻylab topilmaydi.",
      },
    },
  ],

  /* ─────────────────────── сертификаты ─────────────────────── */
  certificates: [
    {
      type: "lead",
      text: {
        ru: "Документы, подтверждающие безопасность продукции и соответствие санитарным требованиям. Копии предоставляем по запросу.",
        uz: "Mahsulot xavfsizligi va sanitariya talablariga muvofiqligini tasdiqlovchi hujjatlar. Nusxalarini soʻrov boʻyicha taqdim etamiz.",
      },
    },
    {
      type: "cards",
      items: [
        {
          title: { ru: "Санитарно-эпидемиологическое заключение", uz: "Sanitariya-epidemiologik xulosa" },
          text: {
            ru: "Выдано на помещение кухни и зала по адресу Амир Темур, 120. Подтверждает соответствие санитарным нормам для предприятий общественного питания.",
            uz: "Amir Temur 120 manzilidagi oshxona va zal binosiga berilgan. Umumiy ovqatlanish korxonalari uchun sanitariya normalariga muvofiqligini tasdiqlaydi.",
          },
          meta: { ru: "№ [номер] от [дата]", uz: "№ [raqam], [sana]" },
        },
        {
          title: { ru: "Декларация о соответствии продукции", uz: "Mahsulot muvofiqligi deklaratsiyasi" },
          text: {
            ru: "Распространяется на готовую продукцию собственного производства: роллы, суши, сеты и горячие блюда.",
            uz: "Oʻz ishlab chiqarishimizdagi tayyor mahsulotga tegishli: rollar, sushi, setlar va issiq taomlar.",
          },
          meta: { ru: "№ [номер] от [дата]", uz: "№ [raqam], [sana]" },
        },
        {
          title: { ru: "Медицинские книжки персонала", uz: "Xodimlarning tibbiy daftarchalari" },
          text: {
            ru: "Все сотрудники кухни и курьеры проходят медицинский осмотр в установленные сроки. Книжки хранятся у администратора.",
            uz: "Oshxona xodimlari va kuryerlar belgilangan muddatlarda tibbiy koʻrikdan oʻtadi. Daftarchalar administratorda saqlanadi.",
          },
          meta: { ru: "обновляются ежегодно", uz: "har yili yangilanadi" },
        },
        {
          title: { ru: "Документы на сырьё", uz: "Xomashyo hujjatlari" },
          text: {
            ru: "На рыбу, морепродукты и молочную продукцию поставщики предоставляют ветеринарные свидетельства и декларации. Храним весь пакет по каждой поставке.",
            uz: "Baliq, dengiz mahsulotlari va sut mahsulotlariga yetkazib beruvchilar veterinariya guvohnomalari va deklaratsiyalar taqdim etadi. Har bir yetkazish boʻyicha butun paketni saqlaymiz.",
          },
          meta: { ru: "по каждой поставке", uz: "har bir yetkazish boʻyicha" },
        },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Номера и даты документов заполняет заведение из оригиналов. Номера сертификатов — официальные идентификаторы, указывать их произвольно нельзя.",
        uz: "Hujjat raqamlari va sanalarini muassasa asl nusxalardan toʻldiradi. Sertifikat raqamlari rasmiy identifikatorlar boʻlib, ixtiyoriy koʻrsatilmaydi.",
      },
    },
  ],

  /* ──────────────── правила возврата и возмещения ──────────────── */
  returns: [
    {
      type: "lead",
      text: {
        ru: "Готовая еда — товар особого рода: вернуть её как обычную покупку нельзя. Но если с заказом что-то не так, мы разбираемся и компенсируем.",
        uz: "Tayyor taom — alohida turdagi mahsulot: uni oddiy xarid kabi qaytarib boʻlmaydi. Lekin buyurtmada nimadir notoʻgʻri boʻlsa, koʻrib chiqamiz va qoplaymiz.",
      },
    },
    {
      type: "list",
      title: { ru: "Когда мы возвращаем деньги или переделываем заказ", uz: "Qachon pulni qaytaramiz yoki buyurtmani qayta tayyorlaymiz" },
      items: [
        { ru: "Привезли не то, что было в заказе", uz: "Buyurtmada boʻlmagan narsa keltirildi" },
        { ru: "Блюдо испорчено или нарушена целостность упаковки", uz: "Taom buzilgan yoki qadoq butunligi buzilgan" },
        { ru: "Состав не соответствует заявленному на сайте", uz: "Tarkib saytda koʻrsatilganiga mos emas" },
        { ru: "Заказ не доставлен в согласованный срок по нашей вине", uz: "Buyurtma bizning aybimiz bilan kelishilgan muddatda yetkazilmadi" },
      ],
    },
    {
      type: "steps",
      items: [
        {
          title: { ru: "Сообщите сразу", uz: "Darhol xabar bering" },
          text: {
            ru: "Позвоните на 88 345 05 93 в день получения заказа, до того как блюдо съедено. Так мы сможем проверить партию и понять, где ошиблись.",
            uz: "Buyurtmani olgan kuni, taom yeyilgunga qadar 88 345 05 93 ga qoʻngʻiroq qiling. Shunda partiyani tekshirib, qayerda xato qilganimizni tushunamiz.",
          },
        },
        {
          title: { ru: "Покажите заказ", uz: "Buyurtmani koʻrsating" },
          text: {
            ru: "Понадобится номер заказа и фотография блюда и упаковки. Этого достаточно — чеки и накладные не нужны.",
            uz: "Buyurtma raqami va taom hamda qadoq surati kerak boʻladi. Shu yetarli — chek va yuk xatlari kerak emas.",
          },
        },
        {
          title: { ru: "Выберите решение", uz: "Yechimni tanlang" },
          text: {
            ru: "Переделаем и привезём заново за наш счёт, вернём деньги за позицию или начислим её стоимость бонусами — что удобнее вам.",
            uz: "Qayta tayyorlab, oʻz hisobimizdan yetkazamiz, taom uchun pulni qaytaramiz yoki uning qiymatini bonus qilib beramiz — sizga qulayi.",
          },
        },
        {
          title: { ru: "Получите возврат", uz: "Qaytarishni oling" },
          text: {
            ru: "Наличными возвращаем сразу с курьером. По безналичной оплате — на ту же карту или счёт, срок зачисления зависит от банка.",
            uz: "Naqd pulni kuryer bilan darhol qaytaramiz. Naqd pulsiz toʻlovda — oʻsha karta yoki hisobga, tushish muddati bankka bogʻliq.",
          },
        },
      ],
    },
    {
      type: "list",
      title: { ru: "Когда вернуть не получится", uz: "Qachon qaytarib boʻlmaydi" },
      items: [
        { ru: "Блюдо съедено полностью или почти полностью", uz: "Taom toʻliq yoki deyarli toʻliq yeyilgan" },
        { ru: "Обращение поступило на следующий день и позже", uz: "Murojaat ertasi kuni yoki keyinroq kelgan" },
        { ru: "Заказ хранился с нарушением условий — вне холодильника более двух часов", uz: "Buyurtma shartlarni buzgan holda saqlangan — muzlatgichdan tashqarida ikki soatdan ortiq" },
        { ru: "Вкус не понравился, при том что состав соответствует описанию", uz: "Taʼmi yoqmadi, lekin tarkib tavsifga mos" },
      ],
    },
    {
      type: "note",
      text: {
        ru: "Сроки рассмотрения обращений и порядок возврата безналичных платежей заведение приводит в соответствие с законодательством Республики Узбекистан и договорами с платёжными сервисами.",
        uz: "Murojaatlarni koʻrib chiqish muddatlari va naqd pulsiz toʻlovlarni qaytarish tartibini muassasa Oʻzbekiston Respublikasi qonunchiligi va toʻlov xizmatlari bilan shartnomalarga muvofiqlashtiradi.",
      },
    },
  ],
};
