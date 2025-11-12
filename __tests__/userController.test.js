// __tests__/userController.test.js

// Importe o controller que você quer testar
const userController = require('../src/controllers/userController');

// Mock do modelo (UserModel) para isolar o controller
jest.mock('../src/models/UserModel', () => {
  // Retorna um objeto com as funções que o controller usa, todas mockadas
  return {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };
});

// Importe o modelo mockado *depois* de ter feito o mock
const UserModel = require('../src/models/UserModel');

// Limpar os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

describe('userController', () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Permite encadeamento: res.status(200).json(...)
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('listUsers', () => {
    test('Deve retornar status 200 e a lista de usuários', async () => { // Tornar assíncrono
      // Arrange
      const mockUsers = [
        { id: 1, name: 'Yves', email: 'yves@example.com' },
        { id: 2, name: 'Teste', email: 'teste@example.com' },
      ];
      UserModel.getAllUsers.mockResolvedValue(mockUsers); // Usar mockResolvedValue

      // Act
      await userController.listUsers(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
      expect(UserModel.getAllUsers).toHaveBeenCalledTimes(1);
    });

    test('Deve retornar status 500 se o modelo lançar um erro', async () => { // Tornar assíncrono
      // Arrange
      const errorMessage = 'Erro interno do modelo';
      UserModel.getAllUsers.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act
      await userController.listUsers(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getUserById', () => {
    test('Deve retornar status 200 e o usuário encontrado', async () => { // Tornar assíncrono
      // Arrange
      const userId = 1;
      mockRequest.params = { id: userId.toString() }; // Simula req.params.id
      const mockUser = { id: userId, name: 'Yves', email: 'yves@example.com' };
      UserModel.getUserById.mockResolvedValue(mockUser); // Usar mockResolvedValue

      // Act
      await userController.getUserById(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
      expect(UserModel.getUserById).toHaveBeenCalledWith(userId);
    });

    test('Deve retornar status 404 se o usuário não for encontrado', async () => { // Tornar assíncrono
      // Arrange
      const userId = 999;
      mockRequest.params = { id: userId.toString() };
      UserModel.getUserById.mockResolvedValue(null); // O modelo retorna null se não encontrar

      // Act
      await userController.getUserById(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
      expect(UserModel.getUserById).toHaveBeenCalledWith(userId);
    });

    test('Deve retornar status 500 se o modelo lançar um erro', async () => { // Tornar assíncrono
      // Arrange
      const userId = 1;
      mockRequest.params = { id: userId.toString() };
      const errorMessage = 'Erro ao buscar usuário';
      UserModel.getUserById.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act
      await userController.getUserById(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Exemplo para createUser
  describe('createUser', () => {
    test('Deve retornar status 201 e o usuário criado', async () => { // Tornar assíncrono
      // Arrange
      const inputUser = { name: 'Novo', email: 'novo@example.com', phone: '123456789' };
      const createdUser = { id: 3, ...inputUser };
      mockRequest.body = inputUser; // Simula req.body
      UserModel.createUser.mockResolvedValue(createdUser); // Usar mockResolvedValue

      // Act
      await userController.createUser(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
      expect(UserModel.createUser).toHaveBeenCalledWith(inputUser);
    });

    test('Deve retornar status 500 se o modelo lançar um erro', async () => { // Tornar assíncrono
      // Arrange
      const inputUser = { name: 'Novo', email: 'novo@example.com', phone: '123456789' };
      mockRequest.body = inputUser;
      const errorMessage = 'Erro ao criar usuário';
      UserModel.createUser.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act
      await userController.createUser(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Exemplo para updateUser
  describe('updateUser', () => {
    test('Deve retornar status 200 e o usuário atualizado', async () => { // Tornar assíncrono
      // Arrange
      const userId = 1;
      const updateData = { name: 'Yves Atualizado', email: 'yves_atualizado@example.com', phone: '987654321' };
      mockRequest.params = { id: userId.toString() }; // Simula req.params.id
      mockRequest.body = updateData; // Simula req.body
      const updatedUser = { id: userId, ...updateData };
      UserModel.updateUser.mockResolvedValue(updatedUser); // Usar mockResolvedValue

      // Act
      await userController.updateUser(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
      expect(UserModel.updateUser).toHaveBeenCalledWith(userId, updateData);
    });

    test('Deve retornar status 500 se o modelo lançar um erro', async () => { // Tornar assíncrono
      // Arrange
      const userId = 1;
      const updateData = { name: 'Yves Atualizado', email: 'yves_atualizado@example.com', phone: '987654321' };
      mockRequest.params = { id: userId.toString() };
      mockRequest.body = updateData;
      const errorMessage = 'Erro ao atualizar usuário';
      UserModel.updateUser.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act
      await userController.updateUser(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  // Exemplo para deleteUser
  describe('deleteUser', () => {
    test('Deve retornar status 204 após deletar', async () => { // Tornar assíncrono
      // Arrange
      const userId = 1;
      mockRequest.params = { id: userId.toString() }; // Simula req.params.id
      UserModel.deleteUser.mockResolvedValue(); // A função delete do modelo não retorna nada

      // Act
      await userController.deleteUser(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled(); // Verifica se send() foi chamado
      expect(UserModel.deleteUser).toHaveBeenCalledWith(userId);
    });

    test('Deve retornar status 500 se o modelo lançar um erro', async () => { // Tornar assíncrono
      // Arrange
      const userId = 1;
      mockRequest.params = { id: userId.toString() };
      const errorMessage = 'Erro ao deletar usuário';
      UserModel.deleteUser.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act
      await userController.deleteUser(mockRequest, mockResponse); // Esperar pela Promise

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});