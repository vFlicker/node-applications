- HTTP Server
  4.1. Caching (hight watermark після якого буде видаляти дані, мемоїзація, видаляти після певної кількості)
  4.2. Cookie parser -- парсинг кукі, спочатку був рядок, а потім став колекшен з кукі
  + 4.3. Buffer piping
  4.4. Logging
  + 4.5. Routing

- БД
- Data access layer (api для роботи з БД) -- задача щоб код застосунку знав про зберігання як можна менше

+ Config
- add watch files
- Serializer/deserializer -- задача цього шару, щоб всі інші знали менше про перетворення даних
- Domain specific business logic -- абстракції предметної області
- Dependency manipulation
