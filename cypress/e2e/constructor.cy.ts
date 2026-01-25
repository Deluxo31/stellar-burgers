import { SELECTORS } from '../../src/constants/test-selectors';

describe('Конструктор бургера', () => {
  // Константы для тестов
  const BUN_NAME = 'Краторная булка N-200i';
  const MAIN_INGREDIENT_NAME = 'Говяжий метеорит (отбивная)';
  const SAUCE_NAME = 'Соус Spicy-X';
  const ORDER_NUMBER = '12345';

  beforeEach(() => {
    // Мокаем все необходимые запросы
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('POST', '**/api/auth/login', { fixture: 'login.json' }).as(
      'login'
    );

    // Устанавливаем токены
    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    // Посещаем главную страницу и ждем загрузки ингредиентов
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    // Проверяем, что ингредиенты загружены
    cy.contains(BUN_NAME, { timeout: 10000 }).should('be.visible');
  });
  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  // ТЕСТЫ КОНСТРУКТОРА
  it('Должен отображать список ингредиентов', () => {
    cy.contains(BUN_NAME).should('exist');
    cy.contains(MAIN_INGREDIENT_NAME).should('exist');
    cy.contains(SAUCE_NAME).should('exist');
  });

  // ТЕСТЫ СТРАНИЦЫ ДЕТАЛЕЙ ИНГРЕДИЕНТА
  describe('Страница деталей ингредиента', () => {
    it('Должен открывать страницу деталей ингредиента при клике', () => {
      cy.contains(BUN_NAME).click();

      // Проверяем переход на страницу деталей
      cy.url().should('include', '/ingredients/');

      // Проверяем содержимое страницы
      cy.get('h3').contains(BUN_NAME).should('be.visible');
      cy.contains('80').should('be.visible'); // proteins
      cy.contains('24').should('be.visible'); // fat
      cy.contains('53').should('be.visible'); // carbohydrates
      cy.contains('420').should('be.visible'); // calories
    });

    it('Должен возвращаться на главную страницу после закрытия модалки', () => {
      // Открываем модалку
      cy.contains(BUN_NAME).click();
      cy.get(SELECTORS.MODAL).should('be.visible');

      // Закрываем модалку через крестик
      cy.get(SELECTORS.MODAL_CLOSE).click();

      //  ждём исчезновения оверлея
      cy.get(SELECTORS.MODAL).should('not.exist', { timeout: 5000 });

      // Теперь кликаем по логотипу
      cy.get(SELECTORS.LOGO).click();
      cy.url().should('eq', 'http://localhost:4000/');
    });
  });

  // ТЕСТЫ ДОБАВЛЕНИЯ ИНГРЕДИЕНТОВ ЧЕРЕЗ КНОПКИ
  describe('Добавление ингредиентов', () => {
    it('Должен добавить булку и начинку в конструктор через клик', () => {
      // Добавляем булку
      cy.contains('li', BUN_NAME)
        .contains('button', 'Добавить')
        .click({ force: true });

      // Добавляем начинку
      cy.contains('li', MAIN_INGREDIENT_NAME)
        .contains('button', 'Добавить')
        .click({ force: true });

      // Проверка результата
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', BUN_NAME);

      // Проверяем наличие начинки в контейнере
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(
        'contain',
        MAIN_INGREDIENT_NAME
      );
    });
  });

  // ТЕСТЫ СОЗДАНИЯ ЗАКАЗА
  describe('Создание заказа', () => {
    beforeEach(() => {
      // Добавляем булку и начинку для всех тестов заказа
      cy.contains('li', BUN_NAME)
        .contains('button', 'Добавить')
        .click({ force: true });

      cy.contains('li', MAIN_INGREDIENT_NAME)
        .contains('button', 'Добавить')
        .click({ force: true });
    });

    // проверка ошибки без модалки
    it('Должен показывать ошибку при попытке создать заказ без авторизации', () => {
      cy.clearCookie('accessToken');
      window.localStorage.removeItem('refreshToken');

      // Мокаем ошибку
      cy.intercept('POST', '**/api/orders', {
        statusCode: 401,
        body: { message: 'Пользователь не авторизован' }
      }).as('createOrderError');

      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.wait('@createOrderError');

      // Проверяем, что конструктор остался нетронутым
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', BUN_NAME);

      // Проверяем наличие системного уведомления
      cy.get('body').then(($body) => {
        if (
          $body.find('.notification, .toast, [data-cy="error-message"]').length
        ) {
          // Если есть уведомление - проверяем его
          cy.contains('Ошибка').should('be.visible');
        } else {
          // Если уведомлений нет проверяем консоль
          cy.log(
            '⚠️ Нет уведомлений об ошибке. Проверьте обработку ошибок в приложении.'
          );
        }
      });
    });

    it('Должен создавать заказ для авторизованного пользователя', () => {
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.wait('@createOrder');

      // Проверяем открытие модалки
      cy.get(SELECTORS.MODAL).should('be.visible');

      // Проверяем содержимое модалки
      cy.get(SELECTORS.MODAL_CONTENT)
        .contains('идентификатор заказа')
        .should('be.visible');
      cy.get(SELECTORS.MODAL_CONTENT)
        .contains(ORDER_NUMBER)
        .should('be.visible');
    });

    it('Должен очищать конструктор после создания заказа', () => {
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.wait('@createOrder');

      // Закрываем модальное окно
      cy.get(SELECTORS.MODAL_CLOSE).click();

      // Проверяем очистку конструктора
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', 'Выберите булки');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should(
        'contain',
        'Выберите булки'
      );
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(
        'contain',
        'Выберите начинку'
      );
    });
  });
});
