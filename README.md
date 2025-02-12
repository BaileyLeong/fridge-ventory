# **Fridge-Ventory**

## Overview

Fridge-Ventory is a web application designed to help individuals and households manage their food inventory, track expiry dates, and discover recipes based on the ingredients they have on hand. By streamlining meal planning and grocery shopping, and adding a playful, gamified twist to recipe selection—the app aims to reduce food waste and make cooking at home more engaging.

### Problem

Keeping track of groceries can be challenging, often leading to food waste and last-minute meal stress. Users typically have to remember what’s in their fridge or rely on inefficient manual methods to plan meals. Fridge-Ventory addresses these issues by providing a digital solution that:

- Monitors food expiry dates.
- Suggests recipes based on available ingredients.
- Helps plan meals and generate grocery lists.
- Introduces interactive elements for engaging food management.

### User Profile

- **Primary Users:**

  - Individuals who want to manage their groceries efficiently.

- **Use Cases:**
  - Add new food items as they are purchased.
  - Receive alerts for items nearing their expiry.
  - Discover recipe ideas based on current fridge inventory.
  - Plan weekly menus and automatically generate grocery lists.

### Features

- **Fridge Management:**  
  As a user, I want to add, edit, and remove food items in my fridge so that I can maintain an accurate inventory.

- **Expiry Tracking:**  
  As a user, I want the app to highlight items close to expiring so that I can prioritize using them.

- **Recipe Suggestions:**  
  As a user, I want to plan meals by selecting recipes and seeing how they fit into my schedule.

  As a user, I want to generate a grocery list based on my planned meals so that I can easily shop for missing ingredients.

- **Meal Planning (Hybrid Approach):**  
  Users can plan meals manually or let the app auto-update daily to always reflect the next 7 days.

- **Random Recipe Selection:**  
  An interactive feature that lets users get a random recipe suggestion.

- **Favorites Management:**  
  As a user, I want to discover recipes using a Random Recipe Selector so that meal planning remains fun and engaging.

---

## Implementation

### Tech Stack

- **Frontend:**

  - React
  - Sass
  - Axios

- **Backend:**

  - Node.js
  - Express

- **Database:**
  - MySQL

### APIs

- **Spoonacular API:**  
  Retrieves recipe ideas by matching the ingredients in the user's fridge.

- **Custom-built API:**  
  Manages fridge inventory and meal planning functions.

### Sitemap

- **Home:**  
  Dashboard with an overview of fridge inventory and expiry alerts.

- **Recipes:**  
  Page displaying recipe suggestions based on available ingredients.

- **Meal Planner:**  
  Interface for planning weekly meals and generating grocery lists.

- **Favorites:**  
  Section where users can view and manage their saved recipes.

### Page Layouts

#### **Landing Page**

- Redirects logged-in users to the dashboard.
- Uses simple animations for engagement, such as a fridge opening effect.

#### **Dashboard (Home Page)**

- Overview of fridge inventory.
- Expiry notifications.
- Quick add/remove buttons for food items.
- Suggested recipes based on available ingredients.

#### **Fridge Management Page**

- Interface for adding, editing, and removing food items.
- Categories for easy organization.
- Search/filter bar to find items quickly.

#### **Recipe Suggestions Page**

- Recipe list fetched based on available ingredients.
- **Random Recipe Selection** feature for engaging meal choices.

#### **Meal Planner Page**

- Hybrid meal planning:
  - Users can manually set meals or let the app auto-update daily.
- Recipe selection for each day.
- Automatic grocery list generation.

#### **Favorites Page**

- Displays a list of the user's saved recipes.
- Allows users to remove recipes from favorites.
- Provides quick access to recipe details.

### Database Schema

<img src="https://monosnap.com/image/VE2YtzEQp6a96LXUyEVj7EDo6GgA1A" alt="Database schema" width="500"/>

---

**Key tables include:**

- **Users** – Stores user details.
- **Recipes** – Stores recipe data, fetched dynamically from the Spoonacular API.
- **Fridge Items** – Tracks the user’s food inventory and expiry dates.
- **Meal Plans** – Allows users to plan meals for the week.
- **Grocery Lists** – Auto-generates shopping lists based on meal plans.
- **Favorite Recipes** – Allows users to save and access preferred recipes.

## Middleware

**`requireUserId` Middleware**

- **Purpose:** Ensures that every request for user‑specific resources includes a valid user ID.
- **Usage:** Applied to routes like `/api/fridge`, `/api/meal-plan`, `/api/grocery-list`, and `/api/favorites`.
- **Example Behavior:**  
  If a request does not include a user ID (e.g., as a query parameter or in the request body), the middleware responds with a `400 Bad Request`.

---

## Endpoints

### Fridge Management

All endpoints under `/api/fridge` require a valid user ID.

- **GET `/api/fridge`**  
  Retrieves the current user’s fridge items.
  
- **POST `/api/fridge`**  
  Adds a new fridge item to the user’s inventory.
  
- **PATCH `/api/fridge/:id`**  
  Updates an existing fridge item (e.g., changes in quantity, expiry date, or other details).
  
- **DELETE `/api/fridge/:id`**  
  Removes a fridge item.

### Recipes & Favorites

#### Recipes (Public)

- **GET `/api/recipes`**  
  Fetches recipe suggestions based on available ingredients.  

- **GET `/api/recipes/:id`**  
  Retrieves details for a specific recipe.

- **GET `/api/recipes/suggest`**  
  Provides recipe suggestions based on the user’s fridge items.  

#### Favorite Recipes (User‑Specific)

All favorite recipe endpoints require a valid user ID.

- **GET `/api/favorites`**  
  Retrieves the user’s favorite recipes.
  
- **POST `/api/favorites`**  
  Adds a recipe to the user’s favorites.
  
- **DELETE `/api/favorites/:id`**  
  Removes a recipe from favorites.

### Meal Planning

All endpoints under `/api/meal-plan` require a valid user ID.

- **GET `/api/meal-plan`**  
  Retrieves the current meal plan for the user.
  
- **POST `/api/meal-plan`**  
  Creates a new meal plan entry and automatically generates missing grocery items based on the recipe's ingredients.
  
- **PUT `/api/meal-plan/:id`**  
  Updates a specific meal plan entry.
  
- **DELETE `/api/meal-plan/:id`**  
  Deletes a meal plan entry.

### Grocery List

All endpoints under `/api/grocery-list` require a valid user ID.

- **GET `/api/grocery-list`**  
  Retrieves the user’s grocery list. Each item is flagged as either:
  - `manual: true` (added manually), or  
  - `manual: false` (generated automatically via meal planning).

- **POST `/api/grocery-list`**  
  Adds a new grocery list item (manual addition). 
  
- **PATCH `/api/grocery-list/:id`**  
  Updates an existing grocery list item.
  
- **DELETE `/api/grocery-list/:id`**  
  Removes a grocery list item.
  
- **PATCH `/api/grocery-list/:id/complete`**  
  Toggles the completion status of a grocery list item.

---

## Roadmap

- **Week 1:**

  - Set up the project and design the database schema.
  - Implement CRUD operations for fridge items.
  - Integrate recipe suggestions using the Spoonacular API.
  - Develop initial meal planning functionality.

- **Week 2:**
  - Introduce **Random Recipe Selection** as an MVP feature.
  - Implement hybrid weekly meal planning UX.
  - Refine the UI and fix bugs.
  - Prepare for the final presentation/demo.

---

### Wireframes

<p align="center">
  <img src="https://monosnap.com/image/c6421P5WbHTqvvx1gurqPwlaps8KZj" alt="Home and Inventory page" width="500">
  <img src="https://monosnap.com/image/vUJXD8YvTVTKFjZuu6IeScZNSIHG42" alt="Recipe, game, and ingredients page" width="500">
</p>

---

## Future Enhancements

- **AI-Powered Recipe Suggestions:**  
  Recommend meals based on user moods or preferences.

- **Receipt Parsing:**  
  Automatically extract grocery items from receipt images via OCR (Google Cloud Vision API).

- **User Authentication:**  
  Implement JWT-based authentication for user accounts.

---
