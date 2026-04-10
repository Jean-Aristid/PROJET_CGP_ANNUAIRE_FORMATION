import { useState } from "react";
import { LogIn, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (login: string) => void;
  error?: string | null;
  loading?: boolean;
}

const demoLogins = [
  { label: "Services centraux", login: "sc.admin" },
  { label: "Administrateur", login: "dsi.tech" },
  { label: "Directeur de composante", login: "bruno.manil" },
  { label: "Directeur administratif", login: "valerie.mottin" },
  { label: "Directeur de département", login: "sophie.toulouse" },
  { label: "Vice-président de département", login: "thierry.hamon" },
  { label: "Directeur adjoint licence", login: "valerie.boucard" },
  { label: "Responsable service pédagogique", login: "elisabeth.christiny" },
  { label: "Responsable adjoint service pédagogique", login: "loredana.yacoubi" },
  { label: "Directeur de mention", login: "pierre.fouilhoux" },
  { label: "Directeur de spécialité", login: "sebastien.guerif" },
  { label: "Responsable de formation", login: "julien.ducoulombier" },
  { label: "Responsable d'année", login: "marc.cesar" },
  { label: "Directeur des études", login: "elodie.david" },
  { label: "Responsable qualité", login: "sylvie.borne" },
  { label: "Référent commun", login: "sebastien.guerif" },
  { label: "Directeur adjoint d'école", login: "lucas.letocart" },
  { label: "Secrétariat pédagogique", login: "aline.dacheux" },
];

export function Login({ onLogin, error, loading }: LoginProps) {
  const [login, setLogin] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = login.trim();
    if (!trimmed) return;
    onLogin(trimmed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-slate-900 mb-2">Connexion de développement</h1>
          <p className="text-slate-600 text-center">
            Annuaire des Formations - Université Sorbonne Paris Nord
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Le CAS réel n'est pas encore branché ici. Cet écran utilise le mode mock du backend
            avec des logins réellement présents dans la base seedée.
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Login utilisateur</label>
            <input
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="ex: sc.admin"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !login.trim()}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-900 font-medium mb-1">Logins de test</p>
            <p className="text-xs text-indigo-800 mb-2">
              Cette liste est alignée sur la base actuelle. Les anciens logins `test.*` ne sont plus seedés.
            </p>
            <div className="grid grid-cols-1 gap-2">
              {demoLogins.map((demo) => (
                <button
                  type="button"
                  key={demo.login}
                  onClick={() => setLogin(demo.login)}
                  className="flex items-center justify-between text-left text-xs text-indigo-700 hover:text-indigo-900"
                >
                  <span>{demo.label}</span>
                  <span className="font-mono">{demo.login}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
