'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Star, TrendingUp, BookOpen, Zap, Settings } from 'lucide-react';
import { improveWithEnhancedAI, improveTextLocally, saveFeedback, getAIStatistics } from '@/lib/enhanced-ai-improver';
import { scoreLegalHebrew } from '@/lib/legal-hebrew-guide';
import { loadAPIKey, saveAPIKey, hasAPIKey } from '@/lib/api-settings';

interface EnhancedAIImproverProps {
  text: string;
  onImprove: (improvedText: string) => void;
  documentType?: string;
  showAnalysis?: boolean;
  placeholder?: string;
  allowTextEdit?: boolean; // אפשר עריכת הטקסט לפני שיפור
}

export default function EnhancedAIImprover({ 
  text, 
  onImprove, 
  documentType,
  showAnalysis = true,
  placeholder,
  allowTextEdit = false
}: EnhancedAIImproverProps) {
  const [currentText, setCurrentText] = useState(text);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedText, setImprovedText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [useAPI, setUseAPI] = useState(hasAPIKey()); // אוטומטי אם יש מפתח שמור
  const [apiKey, setApiKey] = useState('');
  const [textScore, setTextScore] = useState<any>(null);
  const [userRating, setUserRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userCorrection, setUserCorrection] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // טעינת API Key שמור
  useEffect(() => {
    const savedKey = loadAPIKey();
    if (savedKey) {
      setApiKey(savedKey);
      setUseAPI(true);
    }
  }, []);

  // ניתוח הטקסט המקורי
  const analyzeText = () => {
    const analysis = scoreLegalHebrew(currentText);
    setTextScore(analysis);
  };

  // שיפור הטקסט
  const handleImprove = async () => {
    setIsImproving(true);
    setShowResult(false);
    setErrorMessage('');
    
    try {
      let result: string;
      
      if (useAPI && apiKey) {
        // שיפור עם AI API
        const response = await improveWithEnhancedAI(currentText, apiKey, {
          documentType,
          formalityLevel: 'high',
          specificInstructions: textScore?.issues.join('; ')
        });
        
        if (response.success) {
          result = response.improvedText;
        } else {
          setErrorMessage(response.error || 'שגיאה לא ידועה בקריאה ל-API');
          throw new Error(response.error || 'API call failed');
        }
      } else {
        // שיפור מקומי בסיסי
        result = improveTextLocally(currentText);
      }
      
      setImprovedText(result);
      setShowResult(true);
      
      // ניתוח הטקסט המשופר
      const improvedAnalysis = scoreLegalHebrew(result);
      console.log('Improved score:', improvedAnalysis.score);
      
    } catch (error) {
      console.error('Improvement error:', error);
      // השגיאה כבר מוצגת במשתנה errorMessage
    } finally {
      setIsImproving(false);
    }
  };

  // אישור השיפור
  const handleApprove = () => {
    setShowFeedback(true);
  };

  // שימוש בטקסט הסופי (מקורי או מתוקן)
  const handleUseFinal = () => {
    const finalText = userCorrection || improvedText;
    onImprove(finalText);
    
    // שמירה אוטומטית אם יש תיקון
    if (userCorrection && userCorrection !== improvedText && userRating > 0) {
      saveFeedback({
        originalText: currentText,
        improvedText,
        userRating,
        userCorrection,
        documentType
      });
    }
    
    setShowFeedback(false);
    setUserCorrection('');
    setUserRating(0);
  };

  // שמירת פידבק
  const handleSaveFeedback = () => {
    if (userRating > 0) {
      saveFeedback({
        originalText: text,
        improvedText,
        userRating,
        userCorrection: userCorrection || undefined,
        documentType
      });
      
      alert('תודה על המשוב! המערכת תלמד מהדוגמה שלך.');
      setShowFeedback(false);
      setUserRating(0);
      setUserCorrection('');
    }
  };

  const stats = getAIStatistics();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
      {/* כותרת */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-900">
              שיפור AI מתקדם
            </h3>
            <p className="text-sm text-purple-700">
              המרת עברית מתורגמת לעברית משפטית תקנית
            </p>
          </div>
        </div>
        
        {showAnalysis && (
          <button
            onClick={analyzeText}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition text-purple-700 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            נתח טקסט
          </button>
        )}
      </div>

      {/* אזור עריכת טקסט */}
      {allowTextEdit && (
        <div className="bg-white border-2 border-blue-300 rounded-lg p-4">
          <label className="block text-sm font-medium text-blue-900 mb-2">
            {placeholder || 'כתבי או הדביקי טקסט לשיפור:'}
          </label>
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows={6}
            placeholder={placeholder}
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt' }}
          />
        </div>
      )}

      {/* ניתוח הטקסט */}
      {textScore && showAnalysis && (
        <div className="bg-white border-2 border-purple-300 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-purple-900">ניתוח הטקסט המקורי</h4>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className={`text-2xl font-bold ${textScore.score >= 80 ? 'text-green-600' : textScore.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {textScore.score}/100
              </span>
            </div>
          </div>
          
          {textScore.issues.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-purple-800">בעיות שנמצאו:</p>
              <ul className="space-y-1">
                {textScore.issues.map((issue: string, idx: number) => (
                  <li key={idx} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                    ⚠️ {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {textScore.suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-purple-800">המלצות לשיפור:</p>
              <ul className="space-y-1">
                {textScore.suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    ✅ {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* הגדרות AI */}
      <div className="bg-white border-2 border-blue-300 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="use-api"
            checked={useAPI}
            onChange={(e) => setUseAPI(e.target.checked)}
            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="use-api" className="text-sm font-medium text-blue-900">
            השתמש ב-API של Claude (מומלץ מאוד!)
          </label>
        </div>
        
        {useAPI && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-800">
              Anthropic API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="ltr"
              />
              <button
                onClick={() => {
                  saveAPIKey(apiKey);
                  alert('API Key נשמר בהצלחה! עכשיו הוא יהיה זמין בכל המערכת.');
                }}
                disabled={!apiKey || !apiKey.startsWith('sk-ant-')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>שמור</span>
              </button>
            </div>
            <p className="text-xs text-blue-600">
              💡 עם API תקבלי שיפור משמעותי באיכות. המפתח נשמר בדפדפן ויהיה זמין בכל המסמכים.
            </p>
          </div>
        )}
        
        {!useAPI && (
          <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            ⚠️ שיפור מקומי (ללא API) מספק תיקונים בסיסיים בלבד. לתוצאות מיטביות, מומלץ להשתמש ב-API.
          </p>
        )}
      </div>

      {/* כפתור שיפור */}
      <button
        onClick={handleImprove}
        disabled={isImproving || (useAPI && !apiKey)}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg shadow-lg"
      >
        {isImproving ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>משפר את הטקסט...</span>
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" />
            <span>שפר לעברית משפטית תקנית</span>
          </>
        )}
      </button>

      {/* הצגת שגיאה */}
      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">!</div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900 mb-2">שגיאה בשיפור הטקסט</h4>
              <p className="text-red-800 mb-3">{errorMessage}</p>
              
              <div className="bg-red-100 border border-red-200 rounded p-3 text-sm text-red-900">
                <p className="font-bold mb-2">💡 טיפים לפתרון בעיות:</p>
                <ul className="space-y-1 mr-4">
                  <li>• בדקי שה-API Key תקין (מתחיל ב-sk-ant-)</li>
                  <li>• בדקי שיש לך יתרת קרדיט ב-Anthropic</li>
                  <li>• אם הטקסט ארוך מדי, נסי לקצר אותו</li>
                  <li>• בדקי את החיבור לאינטרנט</li>
                  <li>• אפשר גם לנסות ללא API (שיפור בסיסי מקומי)</li>
                </ul>
              </div>

              <button
                onClick={() => setErrorMessage('')}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* תוצאה - עם אפשרות עריכה! */}
      {showResult && improvedText && (
        <div className="bg-white border-2 border-green-300 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-green-900">טקסט משופר - ניתן לעריכה!</h4>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-sm text-yellow-800 mb-3">
            💡 <strong>טיפ:</strong> ערכי את הטקסט למטה כדי שהמערכת תלמד מהתיקונים שלך!
          </div>
          
          <textarea
            value={userCorrection || improvedText}
            onChange={(e) => setUserCorrection(e.target.value)}
            className="w-full px-4 py-4 border-2 border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 resize-none bg-green-50"
            rows={12}
            dir="rtl"
            style={{ fontFamily: 'David', fontSize: '13pt', lineHeight: '1.8' }}
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowResult(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <ThumbsDown className="w-5 h-5 inline ml-2" />
              <span>שפר שוב</span>
            </button>
            
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-bold shadow-lg"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>השתמש בטקסט {userCorrection && userCorrection !== improvedText ? 'המתוקן' : 'המשופר'}</span>
            </button>
          </div>
        </div>
      )}

      {/* פידבק - מערכת למידה */}
      {showFeedback && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-yellow-900 text-lg">עזרי למערכת ללמוד ולהשתפר!</h4>
              <p className="text-sm text-yellow-700">התיקונים שלך יעזרו למערכת לכתוב טוב יותר בעתיד</p>
            </div>
          </div>
          
          {/* אזור עריכת התוצאה */}
          <div className="bg-white border-2 border-yellow-300 rounded-lg p-4 space-y-3">
            <label className="block text-sm font-medium text-yellow-900">
              📝 ערכי את הטקסט המשופר אם צריך (זו הדרך המרכזית ללמידה!):
            </label>
            <textarea
              value={userCorrection || improvedText}
              onChange={(e) => setUserCorrection(e.target.value)}
              className="w-full px-4 py-3 border-2 border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none"
              rows={8}
              placeholder="הדביקי כאן את הגרסה הסופית שלך אחרי התיקונים..."
              dir="rtl"
              style={{ fontFamily: 'David', fontSize: '13pt' }}
            />
            <p className="text-xs text-yellow-700">
              💡 <strong>חשוב:</strong> תקני את הטקסט למה שאת באמת היית כותבת. המערכת תלמד מזה!
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-yellow-800">דרגי את השיפור המקורי של ה-AI:</p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setUserRating(rating)}
                  className={`p-3 rounded-lg transition ${
                    userRating >= rating
                      ? 'text-yellow-500 bg-yellow-100 scale-110'
                      : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                  }`}
                  title={`${rating} כוכבים`}
                >
                  <Star className="w-10 h-10 fill-current" />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-yellow-700">
              {userRating === 0 && 'בחרי כמה כוכבים'}
              {userRating === 1 && '⭐ גרוע - צריך שיפור רב'}
              {userRating === 2 && '⭐⭐ חלש - צריך הרבה תיקונים'}
              {userRating === 3 && '⭐⭐⭐ בסדר - צריך כמה תיקונים'}
              {userRating === 4 && '⭐⭐⭐⭐ טוב - תיקונים קטנים'}
              {userRating === 5 && '⭐⭐⭐⭐⭐ מעולה - כמעט מושלם!'}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>🧠 איך המערכת לומדת:</strong>
            </p>
            <ul className="text-xs text-blue-800 space-y-1 mt-2 mr-4">
              <li>• ה-AI משווה את הטקסט המקורי לגרסה המתוקנת שלך</li>
              <li>• המערכת מזהה את הדפוסים והתיקונים שלך</li>
              <li>• בפעם הבאה, היא תשתמש בדוגמאות שלך לשיפור טוב יותר</li>
              <li>• ככל שתתקני יותר, המערכת תשתפר!</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowFeedback(false);
                setUserCorrection('');
                setUserRating(0);
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              ביטול
            </button>
            <button
              onClick={handleUseFinal}
              disabled={userRating === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold shadow-lg"
            >
              ✅ השתמש {userCorrection && userCorrection !== improvedText ? 'בגרסה המתוקנת' : 'בטקסט'} + שמור ללמידה
            </button>
          </div>
        </div>
      )}

      {/* סטטיסטיקות */}
      {stats.totalFeedbacks > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-bold text-blue-900 mb-2">📊 סטטיסטיקות מערכת הלמידה</h5>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalFeedbacks}</div>
              <div className="text-blue-700">דוגמאות</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.averageRating}/5</div>
              <div className="text-blue-700">דירוג ממוצע</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.improvementRate}</div>
              <div className="text-blue-700">הצלחה</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

