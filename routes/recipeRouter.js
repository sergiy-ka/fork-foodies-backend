import express from 'express';

import recipeController from '../controllers/recipeControllers.js';
import validateBody from '../helpers/validateBody.js';
import { addToFavorites, createRecipeSchema } from '../schemas/recipeSchema.js';

import auth from '../middlewares/auth.js';
import { uploadRecipeImage } from '../middlewares/upload.js';
import { paginationSchema } from '../schemas/paginationSchema.js';
import validateQuery from '../helpers/validateQuery.js';

const recipeRouter = express.Router();

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Add a new recipe to the database. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the recipe
 *                 example: Spaghetti Carbonara
 *               description:
 *                 type: string
 *                 description: The description of the recipe
 *                 example: A classic Italian pasta dish.
 *               category:
 *                 type: string
 *                 description: The category of the recipe
 *                 example: Pasta
 *               area:
 *                 type: string
 *                 description: The area or cuisine of the recipe
 *                 example: Italian
 *               time:
 *                 type: integer
 *                 description: The cooking time in minutes
 *                 example: 30
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId:
 *                       type: string
 *                       description: The ID of the ingredient
 *                       example: 6462a6f04c3d0ddd28897f9b
 *                     quantity:
 *                       type: string
 *                       description: The quantity of the ingredient
 *                       example: 200g
 *               instructions:
 *                 type: string
 *                 description: The cooking instructions
 *                 example: Heat the pan, add oil, and cook the pasta.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the recipe
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Recipe already exists
 *       500:
 *         description: Internal server error
 */
recipeRouter.post(
  '/',
  auth,
  uploadRecipeImage.single('thumb'),
  validateBody(createRecipeSchema),
  recipeController.createRecipe
);

/**
 * @swagger
 * /api/recipes/favorites:
 *   post:
 *     summary: Add a recipe to favorites
 *     description: Add a recipe to the user's favorites list. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: The ID of the recipe to add to favorites
 *                 example: 6462a6f04c3d0ddd28897f9b
 *     responses:
 *       200:
 *         description: Recipe added to favorites successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Recipe not found
 *       409:
 *         description: Recipe already in favorites
 *       500:
 *        description: Internal server error
 */
recipeRouter.post(
  '/favorites',
  auth,
  validateBody(addToFavorites),
  recipeController.addToFavorites
);

/**
 * @swagger
 * /api/recipes/favorites:
 *   delete:
 *     summary: Remove a recipe from favorites
 *     description: Remove a recipe from the user's favorites list. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: The ID of the recipe to remove from favorites
 *                 example: 6462a6f04c3d0ddd28897f9b
 *     responses:
 *       200:
 *         description: Recipe removed from favorites successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Recipe not found
 *       409:
 *         description: Recipe not in favorites
 *       500:
 *         description: Internal server error
 */
recipeRouter.delete(
  '/favorites',
  auth,
  validateBody(addToFavorites),
  recipeController.deleteFromFavorites
);

/**
 * @swagger
 * /api/recipes/favorites:
 *   get:
 *     summary: Get user favorites
 *     description: Retrieve a list of favorite recipes for the authenticated user.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: A list of favorite recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The recipe ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   title:
 *                     type: string
 *                     description: The title of the recipe
 *                     example: Spaghetti Carbonara
 *                   description:
 *                     type: string
 *                     description: The description of the recipe
 *                     example: A classic Italian pasta dish.
 *       400:
 *         description: Bad request 
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
recipeRouter.get(
  '/favorites',
  auth,
  validateQuery(paginationSchema),
  recipeController.getFavorites
);

/**
 * @swagger
 * /api/recipes/{recipeId}:
 *   delete:
 *     summary: Delete a recipe
 *     description: Delete a recipe by its ID. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipe to delete
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Recipe not found
 *       409:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
recipeRouter.delete(
  '/:recipeId', 
  auth, 
  recipeController.deleteRecipe
);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieve a list of all recipes.
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The recipe ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   title:
 *                     type: string
 *                     description: The title of the recipe
 *                     example: Spaghetti Carbonara
 *                   description:
 *                     type: string
 *                     description: The description of the recipe
 *                     example: A classic Italian pasta dish.
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       409:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
recipeRouter.get(
  '/', 
  recipeController.getRecipes
);

/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     summary: Get popular recipes
 *     description: Retrieve a list of popular recipes.
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: A list of popular recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The recipe ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   title:
 *                     type: string
 *                     description: The title of the recipe
 *                     example: Spaghetti Carbonara
 *                   description:
 *                     type: string
 *                     description: The description of the recipe
 *                     example: A classic Italian pasta dish.
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       409:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
recipeRouter.get(
  '/popular', 
  recipeController.getPopularRecipes
);

/**
 * @swagger
 * /api/recipes/own:
 *   get:
 *     summary: Get user recipes
 *     description: Retrieve a list of recipes created by the authenticated user.
 *     tags:
 *       - Recipes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The recipe ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   title:
 *                     type: string
 *                     description: The title of the recipe
 *                     example: Spaghetti Carbonara
 *                   description:
 *                     type: string
 *                     description: The description of the recipe
 *                     example: A classic Italian pasta dish.
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       409:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
recipeRouter.get(
  '/own', 
  auth, 
  recipeController.getUserRecipes
);

/**
 * @swagger
 * /api/recipes/{recipeId}:
 *   get:
 *     summary: Get recipe by ID
 *     description: Retrieve a specific recipe by its ID.
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recipe
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The recipe ID
 *                   example: 6462a6f04c3d0ddd28897f9b
 *                 title:
 *                   type: string
 *                   description: The title of the recipe
 *                   example: Spaghetti Carbonara
 *                 description:
 *                   type: string
 *                   description: The description of the recipe
 *                   example: A classic Italian pasta dish.
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Recipe not found
 *       409:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
recipeRouter.get(
  '/:recipeId', 
  recipeController.getRecipeById
);


export default recipeRouter;
