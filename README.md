# **Fridge-Ventory**

## Overview

Fridge-Ventory is a web application designed to help individuals and households manage their food inventory, track expiry dates, and discover recipes based on the ingredients they have on hand. By streamlining meal planning and grocery shopping, and adding a playful, gamified twist to recipe selection—the app aims to reduce food waste and make cooking at home more engaging.

### Problem

Keeping track of groceries can be challenging, often leading to food waste and last-minute meal stress. Users typically have to remember what’s in their fridge or rely on inefficient manual methods to plan meals. Fridge-Ventory addresses these issues by providing a digital solution that:

- Monitors food expiry dates.
- Suggests recipes based on available ingredients.
- Helps plan weekly meals and generate grocery lists.
- Makes the experience fun through interactive, gamified features.

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
  As a user, I want to receive recipe ideas based on the ingredients I have, assuming I also have basic pantry staples.

- **Meal Planning:**  
  As a user, I want to plan my weekly menu and automatically generate a grocery list based on my selections.

- **Gamified Recipe Selection:**  
  As a user, I want an interactive way to explore recipes, such as a recipe roulette, to make meal selection fun.

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

#### **Landing/Welcome Page**

- **Main Components:**
  - If the user is **already logged in**, redirects them straight to the **dashboard**.
  - Uses **simple animations** for engagement, such as a fridge opening effect.

#### **Home Page (Dashboard)**

- **Main Components:**
  - Overview of fridge inventory (list of food items).
  - Expiry notifications (highlighting soon-to-expire items).
  - Quick add/remove buttons for food items.
  - Suggested recipes based on available ingredients.

#### **Fridge Management Page**

- **Main Components:**
  - Interface for **adding, editing, and removing food items**.
  - Categories for easy organization.
  - Search/filter bar to find items quickly.

#### **Recipe Suggestions Page**

- **Main Components:**
  - Recipe list fetched based on **available ingredients**.
  - A **"Surprise Me" gamified option** for random recipes.

#### **Meal Planner Page**

- **Main Components:**

  - Weekly meal plans dynamically update to always reflect the most recent 7 days.
  - Recipe selection for each day.
  - Automatic **grocery list generation**.

  #### **Favorites Page**

- **Main Components:**

  - Displays a list of the user's saved recipes.
  - Allows users to remove recipes from favorites.
  - Provides quick access to recipe details.

- **User Actions:**
  - View all saved recipes.
  - Click on a recipe to see details.
  - Remove a recipe from favorites.

### Database Schema

#### **Users Table**

- `id` (Primary Key)
- `name` (User's name)
- `email` (User's email)
- `created_at` (Timestamp)

#### **Fridge_Items Table**

- `id` (Primary Key)
- `user_id` (Foreign key linking to Users)
- `name` (Name of the food item, e.g., "Milk")
- `quantity` (Amount of the item)
- `expiry_date` (Expiration date)
- `category` (Food category, e.g., dairy, meat, vegetables)
- `added_at` (Timestamp)

#### **Recipes Table**

- `id` (Primary Key)
- `name` (Recipe name, e.g., "Pasta Carbonara")
- `ingredients` (List of required ingredients)
- `steps` (Cooking instructions)
- `category` (Meal category, e.g., breakfast, lunch, dinner)

#### **Favorite_Recipes Table**

- `id` (Primary Key)
- `user_id` (Foreign key linking to Users)
- `recipe_id` (Foreign key linking to Recipes)
- `saved_at` (Timestamp)

### Endpoints

**GET /fridge** - Retrieve the list of food items in the user's fridge.

**POST /fridge** - Add a new item to the fridge inventory.

**PUT /fridge/:id** - Update an existing fridge item.

**DELETE /fridge/:id** - Remove a food item from the fridge.

**GET /recipes** - Fetch recipe suggestions based on available ingredients.

**POST /recipes/favorite** - Save a recipe to the user's favorite list.

**GET /recipes/favorites** - Retrieve the user's saved favorite recipes.

**POST /meal-plan** - Create a weekly meal plan and generate a corresponding grocery list.

**GET /meal-plan** - Retrieve the current meal plan.

**PUT /meal-plan/:id** - Update a meal in the weekly plan.

**DELETE /meal-plan/:id** - Remove a meal from the weekly plan.

**GET /grocery-list** - Retrieve the auto-generated grocery list based on meal selections.### Roadmap

- **Week 1:**

  - Set up the project and design the database schema.
  - Implement basic CRUD operations for fridge items.
  - Integrate recipe suggestions using the Spoonacular API.
  - Develop initial meal planning functionality.

- **Week 2:**
  - Introduce gamification features for interactive recipe selection.
  - Refine the UI and fix bugs.
  - Prepare for the final presentation/demo.

### Wireframes

<p align="center">
  <img src="https://monosnap.com/image/c6421P5WbHTqvvx1gurqPwlaps8KZj" alt="Home and Inventory page" width="500">
  <img src="https://monosnap.com/image/vUJXD8YvTVTKFjZuu6IeScZNSIHG42" alt="Recipe, game, and ingredients page" width="500">
</p>

### Nice-to-Haves

- **[Future Feature] AI-Powered Recipe Suggestions:**  
  Suggest meals based on user moods or personal preferences.

- **[Future Feature] Receipt Parsing:**  
  Allow users to upload a receipt image and automatically extract grocery items via OCR using the Google Cloud Vision API.

- **[Future Feature] User Authentication (JWT):**  
  Implement **JWT-based authentication** for real user accounts and replace the UUID system with proper login/signup functionality.

---
