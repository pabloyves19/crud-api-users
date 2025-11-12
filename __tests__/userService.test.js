// __tests__/userService.test.js

// Importe o serviço que você quer testar
const userService = require('../src/services/userService');

// Mock do modelo (UserModel) para isolar o serviço
jest.mock('../src/models/UserModel', () => {
  // Retorna um objeto com as funções que o serviço usa, todas mockadas
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

describe('userService', () => {
  describe('listUsers', () => {
    test('Deve retornar a lista de usuários do modelo', async () => {
      // Arrange
      const mockUsers = [
        { id: 1, name: 'Yves', email: 'yves@example.com' },
        { id: 2, name: 'Teste', email: 'teste@example.com' },
      ];
      UserModel.getAllUsers.mockResolvedValue(mockUsers); // Usar mockResolvedValue para Promises

      // Act
      const result = await userService.listUsers(); // Esperar pela Promise

      // Assert
      expect(result).toEqual(mockUsers);
      expect(UserModel.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    test('Deve retornar o usuário encontrado pelo ID', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = { id: userId, name: 'Yves', email: 'yves@example.com' };
      UserModel.getUserById.mockResolvedValue(expectedUser); // Usar mockResolvedValue

      // Act
      const result = await userService.getUserById(userId); // Esperar pela Promise

      // Assert
      expect(result).toEqual(expectedUser);
      expect(UserModel.getUserById).toHaveBeenCalledWith(userId);
    });

    test('Deve retornar null se o usuário não for encontrado', async () => {
      // Arrange
      const userId = 999; // ID inexistente
      UserModel.getUserById.mockResolvedValue(null); // O modelo retorna null se não encontrar

      // Act
      const result = await userService.getUserById(userId); // Esperar pela Promise

      // Assert
      expect(result).toBeNull(); // A função do serviço agora retorna o que o modelo retornar (null)
      expect(UserModel.getUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('createUser', () => {
    test('Deve criar um novo usuário e retornar o novo usuário', async () => {
      // Arrange
      const newUserInput = { name: 'Novo', email: 'novo@example.com', phone: '123456789' };
      const newUserExpected = { id: 2, ...newUserInput }; // ID gerado pelo banco
      UserModel.createUser.mockResolvedValue(newUserExpected); // Usar mockResolvedValue

      // Act
      const result = await userService.createUser(newUserInput); // Esperar pela Promise

      // Assert
      expect(result).toEqual(newUserExpected);
      expect(UserModel.createUser).toHaveBeenCalledWith(newUserInput);
    });
  });

  describe('updateUser', () => {
    test('Deve atualizar um usuário existente e retornar o usuário atualizado', async () => {
      // Arrange
      const userIdToUpdate = 1;
      const updateData = { name: 'Yves Atualizado', email: 'yves_atualizado@example.com', phone: '987654321' };
      const updatedUserExpected = { id: userIdToUpdate, ...updateData };
      UserModel.updateUser.mockResolvedValue(updatedUserExpected); // Usar mockResolvedValue

      // Act
      const result = await userService.updateUser(userIdToUpdate, updateData); // Esperar pela Promise

      // Assert
      expect(result).toEqual(updatedUserExpected);
      expect(UserModel.updateUser).toHaveBeenCalledWith(userIdToUpdate, updateData);
    });

    test('Deve propagar o erro se o modelo lançar um erro', async () => {
      // Arrange
      const userIdToUpdate = 999; // ID inexistente (pode causar erro no modelo, dependendo da implementação)
      const updateData = { name: 'Yves Atualizado', email: 'yves_atualizado@example.com', phone: '987654321' };
      const errorMessage = 'Usuário não encontrado.'; // Exemplo de erro que o modelo pode lançar
      UserModel.updateUser.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act & Assert
      await expect(userService.updateUser(userIdToUpdate, updateData))
        .rejects.toThrow(errorMessage);
      expect(UserModel.updateUser).toHaveBeenCalledWith(userIdToUpdate, updateData);
    });
  });

  describe('deleteUser', () => {
    test('Deve deletar um usuário existente', async () => {
      // Arrange
      const userIdToDelete = 1;
      // A função deleteUser do modelo não retorna nada (undefined), então o mock também não precisa retornar nada
      UserModel.deleteUser.mockResolvedValue(); // Mock para resolver a Promise

      // Act
      await userService.deleteUser(userIdToDelete); // Esperar pela Promise

      // Assert
      expect(UserModel.deleteUser).toHaveBeenCalledWith(userIdToDelete);
    });

    test('Deve propagar o erro se o modelo lançar um erro', async () => {
      // Arrange
      const userIdToDelete = 999; // ID inexistente (pode causar erro no modelo)
      const errorMessage = 'Erro ao deletar usuário.'; // Exemplo de erro
      UserModel.deleteUser.mockRejectedValue(new Error(errorMessage)); // Usar mockRejectedValue

      // Act & Assert
      await expect(userService.deleteUser(userIdToDelete))
        .rejects.toThrow(errorMessage);
      expect(UserModel.deleteUser).toHaveBeenCalledWith(userIdToDelete);
    });
  });
});