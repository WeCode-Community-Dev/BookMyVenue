/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes:
        | `/`
        | `/(auth)`
        | `/(auth)/account/bookings`
        | `/_sitemap`
        | `/account/bookings`
        | `/login`
        | `/signup`
        | `/venues`;
      DynamicRoutes: `/venues/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/venues/[id]`;
    }
  }
}
