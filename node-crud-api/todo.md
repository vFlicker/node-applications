1. Config


-. БД
-. Data access layer (api для роботи з БД) -- задача щоб код застосунку знав про зберігання як можна менше
-. Serializer/deserializer -- задача цього шару, щоб всі інші знали менше про перетворення даних
-. HTTP Server
   4.1. Caching (hight watermark після якого буде видаляти дані, мемоїзація, видаляти після певної кількості)
   4.2. Cookie parser -- парсінг кукі, спочатку була строка, а потім стал колекшен з кукі
   4.3. Buffer piping
   4.4. Logging
   4.5. Routing
-. Domain specific business logic -- абстракції предметної області
-. Dependency manipulation

