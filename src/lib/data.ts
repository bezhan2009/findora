import type { User, Service, Review, Category, Conversation } from './types';

const users: User[] = [
  {
    id: 'user-0',
    name: 'Председатель',
    username: 'chairman',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&h=500&fit=crop',
    location: 'Москва, Россия',
    bio: 'Главный исполнительный директор и основатель BizMart. Курирую лучшие таланты и услуги на платформе.',
    services: ['service-1', 'service-2', 'service-5', 'service-7', 'service-9', 'service-16', 'service-33', 'service-43'],
    reviews: [],
    followers: 9999,
    following: [],
     posts: [
      { id: 'p1', type: 'photo', url: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=400&h=400&fit=crop', caption: 'Проведение командной встречи' },
      { id: 'p2', type: 'photo', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop', caption: 'Наставничество следующего поколения лидеров' },
      { id: 'p3', type: 'photo', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop', caption: 'Заключение сделки' },
    ],
    socials: {
        instagram: "https://instagram.com/bizmart",
        linkedin: "https://linkedin.com/in/bizmart",
        website: "https://bizmart.com",
        email: "chairman@bizmart.com"
    }
  },
  {
    id: 'user-1',
    name: 'Алиса Иванова',
    username: 'alicej',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop',
    location: 'Сан-Франциско, Калифорния',
    bio: 'Опытный веб-разработчик, специализирующийся на React и Next.js. Я создаю красивые и производительные сайты для бизнеса любого размера.',
    services: ['service-1', 'service-2', 'service-6', 'service-10', 'service-28', 'service-37', 'service-47'],
    reviews: ['rev-1', 'rev-2', 'rev-5'],
    followers: 1250,
    following: [],
    posts: [
      { id: 'p1-1', type: 'photo', url: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=400&h=400&fit=crop', caption: 'Недавний проект по UI/UX дизайну' },
      { id: 'p1-2', type: 'photo', url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=400&fit=crop', caption: 'Мое текущее рабочее место' },
      { id: 'p1-3', type: 'photo', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop', caption: 'Код, код и еще раз код.' },
    ],
    socials: {
        linkedin: "https://linkedin.com/in/alicej",
        website: "https://alicej.dev",
        email: "contact@alicej.dev"
    }
  },
  {
    id: 'user-2',
    name: 'Борис Васильев',
    username: 'bobw',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1603415526960-fb0bdd25e347?w=500&h=500&fit=crop',
    location: 'Нью-Йорк, Нью-Йорк',
    bio: 'Графический дизайнер со страстью к созданию потрясающих логотипов и брендинговых материалов. Давайте сделаем ваш бренд заметным!',
    services: ['service-3', 'service-11', 'service-12', 'service-29', 'service-38', 'service-41', 'service-48'],
    reviews: ['rev-3'],
    followers: 840,
    following: [],
    posts: [
       { id: 'p2-1', type: 'photo', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop', caption: 'Проект по брендингу логотипа' },
    ]
  },
  {
    id: 'user-3',
    name: 'Карл Смирнов',
    username: 'charlieb',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a9?w=500&h=500&fit=crop',
    location: 'Остин, Техас',
    bio: 'Я пишу убедительные тексты, которые конвертируют. От постов в блоге до контента для сайта, я помогу вам эффективно донести ваше сообщение.',
    services: ['service-4', 'service-8', 'service-13', 'service-14', 'service-30', 'service-39', 'service-42', 'service-49'],
    reviews: ['rev-4'],
    followers: 530,
    following: [],
    posts: [
       { id: 'p3-1', type: 'photo', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=400&fit=crop', caption: 'Сила хорошего контента.' },
    ]
  },
   {
    id: 'user-4',
    name: 'Диана Князева',
    username: 'dianap',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    location: 'Чикаго, Иллинойс',
    bio: 'Ищу лучших творческих специалистов для своих будущих проектов.',
    services: [],
    reviews: [],
    followers: 50,
    following: [
      { name: 'Алиса Иванова', username: 'alicej', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' },
      { name: 'Борис Васильев', username: 'bobw', avatar: 'https://images.unsplash.com/photo-1603415526960-fb0bdd25e347?w=100&h=100&fit=crop' },
    ],
    orders: [
        { id: 'order-1', serviceTitle: 'Разработка сайта на заказ', providerName: 'Алиса Иванова', providerUsername: 'alicej', date: '2023-10-15', price: 450, status: 'Completed' },
        { id: 'order-2', serviceTitle: 'Профессиональный дизайн логотипа', providerName: 'Борис Васильев', providerUsername: 'bobw', date: '2023-09-01', price: 150, status: 'Completed' },
        { id: 'order-3', serviceTitle: 'Написание SEO-статьи для блога', providerName: 'Карл Смирнов', providerUsername: 'charlieb', date: '2023-11-20', price: 80, status: 'In Progress' },
    ],
    socials: {
        instagram: "https://instagram.com/diana.prince",
        email: "diana.prince@example.com",
        phone: "+1234567890"
    }
  },
  {
    id: 'user-5',
    name: 'Ева Мартинес',
    username: 'evam',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=500&fit=crop',
    location: 'Майами, Флорида',
    bio: 'Маркетинговый стратег, ориентированный на результат, с более чем 8-летним опытом помощи брендам в росте их онлайн-присутствия и увеличении дохода.',
    services: ['service-5', 'service-15', 'service-16', 'service-17', 'service-31', 'service-40', 'service-50'],
    reviews: ['rev-6'],
    followers: 2100,
    following: [],
    posts: [
       { id: 'p5-1', type: 'photo', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', caption: 'Мозговой штурм следующей большой кампании.' },
       { id: 'p5-2', type: 'photo', url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=400&fit=crop', caption: 'Анализ последних рыночных тенденций.' },
    ],
    socials: {
        linkedin: "https://linkedin.com/in/evamartinez",
        website: "https://evadigital.co"
    }
  },
];

const reviews: Review[] = [
    { id: 'rev-1', providerId: 'user-1', author: { name: 'Клиент А', username: 'clienta', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' }, rating: 5, comment: 'Потрясающая работа, выполнено в срок!', date: '2023-10-01' },
    { id: 'rev-2', providerId: 'user-1', author: { name: 'Клиент Б', username: 'clientb', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop' }, rating: 4, comment: 'Отличное общение и качественные результаты.', date: '2023-09-22' },
    { id: 'rev-3', providerId: 'user-2', author: { name: 'Клиент В', username: 'clientc', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' }, rating: 5, comment: 'Превысило мои ожидания. Настоятельно рекомендую.', date: '2023-11-05' },
    { id: 'rev-4', providerId: 'user-3', author: { name: 'Клиент Г', username: 'clientd', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }, rating: 3, comment: 'Хорошая работа, но заняло немного больше времени, чем ожидалось.', date: '2023-10-15' },
    { id: 'rev-5', providerId: 'user-1', author: { name: 'Клиент Д', username: 'cliente', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop' }, rating: 5, comment: 'Алиса — настоящий профессионал. Буду нанимать снова!', date: '2023-11-10' },
    { id: 'rev-6', providerId: 'user-5', author: { name: 'Основатель стартапа', username: 'founder1', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop' }, rating: 5, comment: 'Маркетинговая стратегия Евы удвоила наши лиды за один квартал. Невероятно!', date: '2023-11-15' },
];

const services: Service[] = [
  {
    id: 'service-1',
    title: 'Разработка сайта на заказ',
    description: 'Полный цикл разработки сайта с использованием новейших технологий. Мы создадим адаптивный, быстрый и SEO-дружественный сайт с нуля по вашим требованиям. Включает в себя дизайн-макеты, разработку и развертывание.',
    category: 'Веб-разработка',
    price: 450,
    rating: 4.9,
    reviewsCount: 8,
    reviews: ['rev-1', 'rev-2', 'rev-5'],
    images: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop'],
    provider: { name: users[1].name, username: users[1].username, avatar: users[1].avatar },
    featured: true,
    analytics: { views: 1250, likes: 230, revenue: 4500 }
  },
  {
    id: 'service-2',
    title: 'Настройка E-commerce магазина',
    description: 'Запустите свой интернет-магазин на Shopify или WooCommerce. Услуга включает настройку темы, загрузку товаров, интеграцию платежных шлюзов и базовую SEO-настройку, чтобы помочь вам начать продавать онлайн.',
    category: 'Веб-разработка',
    price: 380,
    rating: 4.8,
    reviewsCount: 12,
    reviews: [],
    images: ['https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop'],
    provider: { name: users[1].name, username: users[1].username, avatar: users[1].avatar },
    analytics: { views: 890, likes: 180, revenue: 3800 }
  },
  {
    id: 'service-3',
    title: 'Профессиональный дизайн логотипа',
    description: 'Я разработаю уникальный и запоминающийся логотип для вашего бренда. Вы получите несколько концепций и правок, чтобы финальный дизайн идеально отражал ценности и идентичность вашего бизнеса.',
    category: 'Графический дизайн',
    price: 150,
    rating: 5.0,
    reviewsCount: 25,
    reviews: ['rev-3'],
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=500&fit=crop'],
    provider: { name: users[2].name, username: users[2].username, avatar: users[2].avatar },
    analytics: { views: 2100, likes: 450, revenue: 6750 }
  },
  {
    id: 'service-4',
    title: 'Написание SEO-статьи для блога',
    description: 'Привлекательные и SEO-оптимизированные посты для блога для привлечения трафика на ваш сайт. Каждая статья тщательно исследуется, пишется в голосе вашего бренда и форматируется для удобства чтения. Ключевые слова будут интегрированы естественным образом.',
    category: 'Написание текстов',
    price: 80,
    rating: 4.7,
    reviewsCount: 42,
    reviews: ['rev-4'],
    images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop'],
    provider: { name: users[3].name, username: users[3].username, avatar: users[3].avatar },
    analytics: { views: 3500, likes: 600, revenue: 3360 }
  },
  {
    id: 'service-5',
    title: 'Управление социальными сетями',
    description: 'Полное управление вашими профилями в социальных сетях (Instagram, Facebook, Twitter). Включает создание контента, график публикаций, взаимодействие с сообществом и ежемесячные отчеты о производительности для роста вашего онлайн-присутствия.',
    category: 'Маркетинг',
    price: 300,
    rating: 4.9,
    reviewsCount: 15,
    reviews: ['rev-6'],
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop'],
    provider: { name: users[4].name, username: users[4].username, avatar: users[4].avatar },
    featured: true,
    analytics: { views: 1800, likes: 320, revenue: 4500 }
  },
];

const categories: Category[] = [
    { id: 'cat-1', name: 'Веб-разработка' },
    { id: 'cat-2', name: 'Графический дизайн' },
    { id: 'cat-3', name: 'Написание текстов' },
    { id: 'cat-4', name: 'Маркетинг' },
    { id: 'cat-5', name: 'Видеопродакшн' },
    { id: 'cat-6', name: 'Бизнес' },
    { id: 'cat-7', name: 'Фотография' },
    { id: 'cat-8', name: 'IT-поддержка' },
];

const conversations: Conversation[] = [
    {
        id: 'conv-1',
        participant: { name: 'Алиса Иванова', username: 'alicej', avatar: users[1].avatar },
        lastMessage: 'Звучит отлично, я приступлю к макетам.',
        timestamp: '10:42',
        messages: [
            { id: 'msg-1-1', sender: 'other', text: 'Привет! Я видел ваш профиль и заинтересован в новом сайте для моего кафе.', timestamp: '10:30' },
            { id: 'msg-1-2', sender: 'me', text: 'Здравствуйте! Спасибо за обращение. Я с удовольствием помогу. У вас есть существующий сайт или идеи по дизайну?', timestamp: '10:31' },
            { id: 'msg-1-3', sender: 'other', text: 'Не совсем, я надеялся, вы тоже сможете с этим помочь.', timestamp: '10:40' },
            { id: 'msg-1-4', sender: 'me', text: 'Конечно. Я могу создать для вас полное дизайн-предложение.', timestamp: '10:41' },
            { id: 'msg-1-5', sender: 'other', text: 'Звучит отлично, я приступлю к макетам.', timestamp: '10:42' },
        ]
    },
    {
        id: 'conv-2',
        participant: { name: 'Борис Васильев', username: 'bobw', avatar: users[2].avatar },
        lastMessage: 'Отлично, с нетерпением жду концепций.',
        timestamp: 'Вчера',
        messages: [
            { id: 'msg-2-1', sender: 'me', text: 'Привет, Борис, мне нужен новый логотип для моего стартапа.', timestamp: 'Вчера' },
            { id: 'msg-2-2', sender: 'other', text: 'Привет! Я определенно могу с этим помочь. О чем ваш стартап?', timestamp: 'Вчера' },
        ]
    }
];

export const initialData = {
    users,
    services,
    reviews,
    categories,
    conversations
};
