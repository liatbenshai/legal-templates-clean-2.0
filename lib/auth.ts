import { supabase } from './supabase-client';
import { User, LoginCredentials, RegisterData } from './auth-types';

/**
 * מחלקה לניהול אימות עם Supabase
 */
export class AuthService {
  /**
   * הרשמה
   */
  static async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // הרשמה ב-Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone || '',
            company: data.company || '',
          }
        }
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        return { 
          success: false, 
          error: authError.message === 'User already registered' 
            ? 'כתובת המייל כבר קיימת במערכת' 
            : 'שגיאה בהרשמה, אנא נסה שוב'
        };
      }

      if (!authData.user) {
        return { success: false, error: 'שגיאה ביצירת משתמש' };
      }

      // יצירת פרופיל בטבלה שלנו
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          phone: data.phone || null,
          company: data.company || null,
          license_number: data.licenseNumber || null,
          office_address: data.officeAddress || null,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // נמשיך בכל זאת - הפרופיל יכול להיווצר אחר כך
      }

      // המרה ל-User שלנו
      const user: User = {
        id: authData.user.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        company: data.company,
        licenseNumber: data.licenseNumber,
        officeAddress: data.officeAddress,
        role: 'user',
        createdAt: authData.user.created_at,
        lastLogin: new Date().toISOString(),
        settings: {
          emailNotifications: true,
          saveHistory: true,
          defaultFontSize: 12,
          theme: 'light',
        },
      };

      return { success: true, user };
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
      // התחברות ב-Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        console.error('Login error:', authError);
        return { 
          success: false, 
          error: 'שם משתמש או סיסמה שגויים'
        };
      }

      if (!authData.user) {
        return { success: false, error: 'שגיאה בהתחברות' };
      }

      // קבלת פרופיל המשתמש
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // המרה ל-User שלנו
      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile?.name || authData.user.user_metadata?.name || 'משתמש',
        phone: profile?.phone || authData.user.user_metadata?.phone,
        company: profile?.company || authData.user.user_metadata?.company,
        licenseNumber: profile?.license_number,
        officeAddress: profile?.office_address,
        role: 'user',
        createdAt: authData.user.created_at,
        lastLogin: new Date().toISOString(),
        settings: {
          emailNotifications: true,
          saveHistory: true,
          defaultFontSize: 12,
          theme: 'light',
        },
      };

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'שגיאה בהתחברות, אנא נסה שוב' };
    }
  }

  /**
   * התנתקות
   */
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * קבלת משתמש נוכחי
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        return null;
      }

      // קבלת פרופיל
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const user: User = {
        id: authUser.id,
        email: authUser.email!,
        name: profile?.name || authUser.user_metadata?.name || 'משתמש',
        phone: profile?.phone || authUser.user_metadata?.phone,
        company: profile?.company || authUser.user_metadata?.company,
        licenseNumber: profile?.license_number,
        officeAddress: profile?.office_address,
        role: 'user',
        createdAt: authUser.created_at,
        lastLogin: new Date().toISOString(),
        settings: {
          emailNotifications: true,
          saveHistory: true,
          defaultFontSize: 12,
          theme: 'light',
        },
      };

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * בדיקה אם משתמש מחובר (סינכרונית - מהירה)
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    // בדיקה מהירה אם יש session
    const session = supabase.auth.getSession();
    return session !== null;
  }

  /**
   * עדכון פרטי משתמש
   */
  static async updateUser(updatedUser: Partial<User> & { id: string }): Promise<boolean> {
    try {
      // עדכון פרופיל בטבלה
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          phone: updatedUser.phone,
          company: updatedUser.company,
          license_number: updatedUser.licenseNumber,
          office_address: updatedUser.officeAddress,
        })
        .eq('id', updatedUser.id);

      if (error) {
        console.error('Update user error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  }

  /**
   * שינוי סיסמה
   */
  static async changePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Change password error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  /**
   * שחזור סיסמה
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: 'שגיאה בשליחת מייל לאיפוס סיסמה' };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'שגיאה בשליחת מייל לאיפוס סיסמה' };
    }
  }
}
