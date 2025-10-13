import { User, LoginCredentials, RegisterData } from './auth-types';

// מחלקה לניהול אימות
export class AuthService {
  private static readonly USERS_KEY = 'users';
  private static readonly CURRENT_USER_KEY = 'currentUser';
  private static readonly SESSION_KEY = 'userSession';

  /**
   * הרשמה
   */
  static async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // בדיקה אם המשתמש כבר קיים
      const users = this.getUsers();
      const existingUser = users.find(u => u.email === data.email);
      
      if (existingUser) {
        return { success: false, error: 'כתובת המייל כבר קיימת במערכת' };
      }

      // יצירת משתמש חדש
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        phone: data.phone,
        company: data.company,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        settings: {
          emailNotifications: true,
          saveHistory: true,
          defaultFontSize: 12,
          theme: 'light',
        },
      };

      // שמירת סיסמה מוצפנת (בפרודקשן יש להשתמש בהצפנה אמיתית)
      const hashedPassword = btoa(data.password); // בפרודקשן להשתמש ב-bcrypt
      
      users.push(newUser);
      this.saveUsers(users);
      
      // שמירת סיסמה בנפרד
      const passwords = this.getPasswords();
      passwords[newUser.id] = hashedPassword;
      this.savePasswords(passwords);

      // התחברות אוטומטית
      this.setCurrentUser(newUser);
      this.setCookie('currentUser', newUser.id);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'שגיאה בהרשמה, אנא נסה שוב' };
    }
  }

  /**
   * התחברות
   */
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        return { success: false, error: 'שם משתמש או סיסמה שגויים' };
      }

      // בדיקת סיסמה
      const passwords = this.getPasswords();
      const hashedPassword = btoa(credentials.password);
      
      if (passwords[user.id] !== hashedPassword) {
        return { success: false, error: 'שם משתמש או סיסמה שגויים' };
      }

      // עדכון זמן כניסה אחרון
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);

      // שמירת משתמש נוכחי
      this.setCurrentUser(user);
      this.setCookie('currentUser', user.id);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'שגיאה בהתחברות, אנא נסה שוב' };
    }
  }

  /**
   * התנתקות
   */
  static logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    this.deleteCookie('currentUser');
  }

  /**
   * קבלת משתמש נוכחי
   */
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      
      // Migration: הוספת שדות חדשים למשתמשים ישנים
      if (user && (user.licenseNumber === undefined || user.officeAddress === undefined)) {
        user.licenseNumber = user.licenseNumber || '';
        user.officeAddress = user.officeAddress || '';
        this.setCurrentUser(user);
        this.updateUser(user);
      }
      
      return user;
    } catch {
      return null;
    }
  }

  /**
   * בדיקה אם משתמש מחובר
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * עדכון פרטי משתמש
   */
  static updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
      
      // אם זה המשתמש הנוכחי, עדכן גם אותו
      const currentUser = this.getCurrentUser();
      if (currentUser?.id === updatedUser.id) {
        this.setCurrentUser(updatedUser);
      }
    }
  }

  /**
   * שינוי סיסמה
   */
  static changePassword(userId: string, oldPassword: string, newPassword: string): boolean {
    const passwords = this.getPasswords();
    const oldHashed = btoa(oldPassword);
    
    if (passwords[userId] !== oldHashed) {
      return false;
    }

    passwords[userId] = btoa(newPassword);
    this.savePasswords(passwords);
    return true;
  }

  // פונקציות פרטיות
  private static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
      const usersStr = localStorage.getItem(this.USERS_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch {
      return [];
    }
  }

  private static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private static setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.SESSION_KEY, Date.now().toString());
  }

  private static getPasswords(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
      const pwdStr = localStorage.getItem('passwords');
      return pwdStr ? JSON.parse(pwdStr) : {};
    } catch {
      return {};
    }
  }

  private static savePasswords(passwords: Record<string, string>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }

  // פונקציות Cookies
  private static setCookie(name: string, value: string, days: number = 7): void {
    if (typeof window === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private static deleteCookie(name: string): void {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }

  private static getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
