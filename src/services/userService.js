// src/services/userService.js

const UserModel = require('../models/UserModel'); // Importa o modelo correto

// Função para obter todos os usuários
const listUsers = async () => { // Tornar assíncrona e usar await
    return await UserModel.getAllUsers(); // Chama a função assíncrona do modelo
};

// Função para obter um usuário por ID
const getUserById = async (id) => { // Tornar assíncrona e usar await
    return await UserModel.getUserById(id); // Chama a função assíncrona do modelo
};

// Função para criar um novo usuário
const createUser = async (userData) => { // Tornar assíncrona e usar await
    return await UserModel.createUser(userData); // Chama a função assíncrona do modelo
};

// Função para atualizar um usuário
const updateUser = async (id, updatedData) => { // Tornar assíncrona e usar await
    return await UserModel.updateUser(id, updatedData); // Chama a função assíncrona do modelo
};

// Função para deletar um usuário
const deleteUser = async (id) => { // Tornar assíncrona e usar await
    await UserModel.deleteUser(id); // Chama a função assíncrona do modelo (não retorna nada)
};

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser };