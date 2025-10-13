'use client';

import { useState } from 'react';
import { Scale, RefreshCw } from 'lucide-react';
import DynamicTable, { TableColumn, TableRow } from './DynamicTable';
import GenderSelector from './GenderSelector';
import type { Gender } from '@/lib/hebrew-gender';

/**
 * טבלת צדדים מתקדמת לכתבי בית דין
 * גמישות מקסימלית - משתנה לפי מי אני מייצג
 */

export type PartyRole = 'plaintiff' | 'defendant';

interface Party extends TableRow {
  name: string;
  idNumber: string;
  address?: string;
  phone?: string;
  email?: string;
  gender?: Gender;
  represented?: boolean; // האם יש לו ב"כ
  lawyer?: string; // שם הב"כ
}

interface PartyTableProps {
  myRole: PartyRole;
  myParties: Party[];
  opponentParties: Party[];
  onMyPartiesChange: (parties: Party[]) => void;
  onOpponentPartiesChange: (parties: Party[]) => void;
  onRoleSwitch?: () => void;
  showRoleSwitch?: boolean;
}

export default function PartyTable({
  myRole,
  myParties,
  opponentParties,
  onMyPartiesChange,
  onOpponentPartiesChange,
  onRoleSwitch,
  showRoleSwitch = true
}: PartyTableProps) {
  const myRoleLabel = myRole === 'plaintiff' ? 'התובעים' : 'הנתבעים';
  const opponentRoleLabel = myRole === 'plaintiff' ? 'הנתבעים' : 'התובעים';

  // עמודות מלאות למי שאני מייצג
  const myColumns: TableColumn[] = [
    { id: 'name', name: 'שם מלא', type: 'text', required: true },
    { id: 'idNumber', name: 'תעודת זהות', type: 'id-number', required: true },
    { id: 'address', name: 'כתובת', type: 'text' },
    { id: 'phone', name: 'טלפון', type: 'text' },
    { id: 'email', name: 'אימייל', type: 'text' },
  ];

  // עמודות מינימליות לצד השני
  const opponentColumns: TableColumn[] = [
    { id: 'name', name: 'שם מלא', type: 'text', required: true },
    { id: 'idNumber', name: 'תעודת זהות', type: 'id-number', required: true },
  ];

  return (
    <div className="space-y-6">
      {/* בחירת תפקיד */}
      {showRoleSwitch && onRoleSwitch && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-blue-700" />
              <div>
                <div className="font-bold text-gray-900 mb-1">אני מייצג את:</div>
                <div className="text-2xl font-bold text-blue-700">{myRoleLabel}</div>
              </div>
            </div>
            <button
              onClick={onRoleSwitch}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>החלף צדדים</span>
            </button>
          </div>
        </div>
      )}

      {/* הצד שלי - טבלה מלאה */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">👥</div>
          <h2 className="text-xl font-bold text-gray-900">{myRoleLabel} (מיוצגים)</h2>
        </div>
        
        <DynamicTable
          columns={myColumns}
          rows={myParties}
          onChange={(rows: any) => onMyPartiesChange(rows as Party[])}
          minRows={1}
          maxRows={20}
        />

        {/* הוספת מגדר לכל צד */}
        <div className="mt-4 space-y-3">
          {myParties.map((party, index) => (
            <div key={party.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-300">
              <span className="font-medium" style={{ fontFamily: 'David' }}>
                {index + 1}. {party.name || '[ללא שם]'}
              </span>
              <div className="mr-auto">
                <GenderSelector
                  value={party.gender || 'male'}
                  onChange={(gender) => {
                    const updated = [...myParties];
                    updated[index] = { ...updated[index], gender };
                    onMyPartiesChange(updated);
                  }}
                  size="small"
                  showOrganization={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* הצד השני - טבלה מצומצמת */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border-2 border-gray-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">👤</div>
          <h2 className="text-xl font-bold text-gray-900">{opponentRoleLabel} (צד שני)</h2>
        </div>
        
        <DynamicTable
          columns={opponentColumns}
          rows={opponentParties}
          onChange={(rows: any) => onOpponentPartiesChange(rows as Party[])}
          minRows={1}
          maxRows={20}
        />

        <div className="mt-3 text-sm text-gray-600">
          💡 לצד השני מוצגים רק פרטים בסיסיים (שם + ת.ז)
        </div>
      </div>

      {/* הסבר */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">ℹ️ איך זה עובד:</p>
        <ul className="space-y-1 mr-4">
          <li>• <strong>מיוצגים שלך</strong> - מלא פרטים מלאים + בחירת מגדר (חשוב לנטיות!)</li>
          <li>• <strong>צד שני</strong> - רק פרטים בסיסיים (שם + ת.ז)</li>
          <li>• לחץ "החלף צדדים" אם התחלת בתפקיד הלא נכון</li>
          <li>• המגדר משפיע על כל הטקסט במסמך (התובע/התובעת)</li>
        </ul>
      </div>
    </div>
  );
}
