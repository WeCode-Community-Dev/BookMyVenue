enum AppEnvironment { dev, prod }

class Environment {
  static late AppEnvironment _env;
  static void init(AppEnvironment env) {
    _env = env;
  }

  static AppEnvironment get current => _env;
}
