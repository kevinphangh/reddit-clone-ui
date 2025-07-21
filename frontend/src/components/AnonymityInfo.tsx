import React from 'react';
import { Shield, Info } from 'lucide-react';

export const AnonymityInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <Shield className="text-blue-600 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
            Dit privatliv er vigtigt
            <Info size={14} className="text-blue-600" />
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            På VIA Pædagoger vises kun dit brugernavn - aldrig dit rigtige navn. 
            Du kan vælge et anonymt brugernavn når du opretter din profil.
          </p>
          <p className="text-sm text-blue-700 mt-2">
            💡 Tip: Vælg et brugernavn der ikke afslører din identitet, 
            f.eks. "StudieVen2024" eller "PraktikantLife"
          </p>
        </div>
      </div>
    </div>
  );
};