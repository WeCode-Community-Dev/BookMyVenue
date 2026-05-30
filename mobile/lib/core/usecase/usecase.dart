abstract class UseCase<ReturnType, Params> {
  ReturnType call(Params params);
}

class NoParams {}
