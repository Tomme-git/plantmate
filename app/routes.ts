import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("collections", "routes/collections.tsx"),
    route("collections/:id", "routes/collection-detail.tsx"),
    route("collections/new", "routes/collection-add.tsx"),
    route("collections/:id/destroy", "routes/collection-destroy.tsx"),
    route("collections/:id/update", "routes/collection-update.tsx"),
    route("collections/:id/remove-recipe", "routes/remove-from-collection.ts"),
    route("chat", "routes/chatbot.ts"),
    route("chatroom", "routes/chatroom.tsx"),
    route("recipes/new", "routes/recipe-add.tsx"),
    route("recipes/:id", "routes/recipe-detail.tsx"),
    route("recipes/:id/destroy", "routes/recipe-destroy.tsx"),
    route("recipes/:id/update", "routes/recipe-update.tsx"),
    route("recipes/:id/add-to-collection", "routes/add-to-collection.ts"),
    route("recipes/:id/toggle-favourite", "routes/toggle-favourite.ts"),
    route("signin", "routes/signin.tsx"),
    route("signup", "routes/signup.tsx"),
    route("profile", "routes/profile.tsx"),
    route ("profile/update", "routes/profile-update.tsx"),
] satisfies RouteConfig;
