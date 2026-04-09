import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, GraduationCap, Mail, Phone, Users } from "lucide-react";
import { AcademicYear, EntiteStructure, UserRole, canAccessFilteredQueries } from "../types";
import { apiFetch } from "../lib/api";
import { FilterBar } from "./ui/filter-bar";
import { writeQueryParams } from "../lib/url-state";
import {
  EMPTY_HIERARCHY_FILTERS,
  HIERARCHY_LEVELS,
  type HierarchyFilters,
  getDeepestSelectedEntiteId,
  getDescendantEntiteIds,
  getHierarchyOptions,
  updateHierarchyFilters,
} from "../lib/entite-hierarchy";

interface DirectorySearchProps {
  currentYear: AcademicYear;
  availableYears: AcademicYear[];
  entites: EntiteStructure[];
  authLogin: string | null;
  userRole: UserRole;
}

type SearchTab = "responsables" | "formations" | "structures" | "secretariats";

type ApiResponsable = {
  id_affectation: number;
  id_user: number;
  nom: string;
  prenom: string;
  email_institutionnel: string | null;
  role_id: string;
  role_label: string;
  id_entite: number;
  entite_nom: string | null;
  type_entite: string | null;
  id_annee: number;
};

type ApiFormation = {
  id_entite: number;
  id_annee: number;
  type_entite: string;
  nom: string;
  tel_service: string | null;
  bureau_service: string | null;
  responsables: Array<{
    id_user: number;
    nom: string;
    prenom: string;
    role_id: string;
    role_label: string;
  }>;
};

type ApiStructure = {
  id_entite: number;
  id_annee: number;
  id_entite_parent: number | null;
  type_entite: string;
  nom: string;
  tel_service: string | null;
  bureau_service: string | null;
  code_composante?: string | null;
  code_interne?: string | null;
};

type PagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

type ApiRole = {
  id?: string;
  id_role?: string;
  libelle: string;
};

const PAGE_SIZE = 20;
const ALL_YEARS_VALUE = "__all__";

const HIERARCHY_EMPTY_LABELS: Record<keyof HierarchyFilters, string> = {
  composanteId: "Toutes les composantes",
  departementId: "Tous les departements",
  mentionId: "Toutes les mentions",
  parcoursId: "Tous les parcours",
  niveauId: "Tous les niveaux",
};

const getRoleId = (role: ApiRole) => role.id || role.id_role || "";

export function DirectorySearch({
  currentYear,
  availableYears,
  entites,
  authLogin,
  userRole,
}: DirectorySearchProps) {
  const canQueryWholeBase =
    canAccessFilteredQueries(userRole) || userRole === "administrateur";

  const [activeTab, setActiveTab] = useState<SearchTab>("responsables");
  const [yearFilter, setYearFilter] = useState(currentYear.id);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [hierarchyFilters, setHierarchyFilters] = useState<HierarchyFilters>(EMPTY_HIERARCHY_FILTERS);
  const [typeEntiteFilter, setTypeEntiteFilter] = useState("");
  const [typeDiplomeFilter, setTypeDiplomeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [entitesLoading, setEntitesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responsables, setResponsables] = useState<ApiResponsable[]>([]);
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [structures, setStructures] = useState<ApiStructure[]>([]);
  const [secretariats, setSecretariats] = useState<ApiStructure[]>([]);
  const [total, setTotal] = useState(0);
  const [allRoles, setAllRoles] = useState<ApiRole[]>([]);
  const [searchEntites, setSearchEntites] = useState<EntiteStructure[]>(entites);

  const selectedYearId =
    canQueryWholeBase && yearFilter === ALL_YEARS_VALUE ? "" : yearFilter;
  const showWholeBaseResults = canQueryWholeBase && !selectedYearId;

  const yearLabelById = useMemo(
    () => new Map(availableYears.map((year) => [Number(year.id), year.year])),
    [availableYears],
  );

  const yearScopeLabel = useMemo(() => {
    if (showWholeBaseResults) {
      return "Toute la base";
    }
    return availableYears.find((year) => year.id === selectedYearId)?.year || currentYear.year;
  }, [availableYears, currentYear.year, selectedYearId, showWholeBaseResults]);

  useEffect(() => {
    if (!canQueryWholeBase) {
      setYearFilter(currentYear.id);
      return;
    }

    setYearFilter((previous) =>
      previous === ALL_YEARS_VALUE ? previous : currentYear.id,
    );
  }, [canQueryWholeBase, currentYear.id]);

  useEffect(() => {
    writeQueryParams({
      ds_tab: "",
      ds_year: "",
      ds_q: "",
      ds_role: "",
      ds_comp: "",
      ds_dept: "",
      ds_mention: "",
      ds_parcours: "",
      ds_niveau: "",
      ds_type: "",
      ds_diplome: "",
      ds_page: "",
    });
  }, []);

  useEffect(() => {
    setHierarchyFilters(EMPTY_HIERARCHY_FILTERS);
  }, [selectedYearId]);

  useEffect(() => {
    if (!authLogin) {
      setSearchEntites(entites);
      return;
    }

    let mounted = true;
    const canReuseCurrentYearEntites =
      selectedYearId !== "" && selectedYearId === currentYear.id && entites.length > 0;

    if (canReuseCurrentYearEntites) {
      setSearchEntites(entites);
    }

    const loadEntites = async () => {
      setEntitesLoading(true);
      try {
        const suffix = selectedYearId ? `?yearId=${selectedYearId}` : "";
        const data = await apiFetch<{ items: EntiteStructure[] }>(`/entites${suffix}`, {
          login: authLogin,
        });
        if (!mounted) return;
        setSearchEntites(data.items || []);
      } catch {
        if (!mounted) return;
        setSearchEntites(canReuseCurrentYearEntites ? entites : []);
      } finally {
        if (mounted) {
          setEntitesLoading(false);
        }
      }
    };

    loadEntites();

    return () => {
      mounted = false;
    };
  }, [authLogin, currentYear.id, entites, selectedYearId]);

  useEffect(() => {
    setPage(1);
  }, [
    activeTab,
    selectedYearId,
    query,
    roleFilter,
    hierarchyFilters,
    typeEntiteFilter,
    typeDiplomeFilter,
  ]);

  useEffect(() => {
    if (activeTab !== "responsables") {
      setRoleFilter("");
    }
    if (activeTab !== "formations") {
      setTypeDiplomeFilter("");
      if (activeTab !== "structures") {
        setTypeEntiteFilter("");
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (!authLogin) return;

    apiFetch<ApiRole[] | { items?: ApiRole[] }>("/roles", { login: authLogin })
      .then((data) => {
        const roleItems = Array.isArray(data) ? data : data.items || [];
        setAllRoles(roleItems.filter((role) => Boolean(getRoleId(role))));
      })
      .catch(() => setAllRoles([]));
  }, [authLogin]);

  const hierarchyOptions = useMemo(
    () =>
      getHierarchyOptions(
        searchEntites,
        hierarchyFilters,
        selectedYearId || null,
      ),
    [searchEntites, hierarchyFilters, selectedYearId],
  );

  const entiteIds = useMemo((): string | undefined => {
    const selectedEntiteId = getDeepestSelectedEntiteId(hierarchyFilters);
    if (!selectedEntiteId) {
      return undefined;
    }

    return Array.from(
      getDescendantEntiteIds(searchEntites, selectedEntiteId, {
        yearId: selectedYearId || null,
      }),
    ).join(",");
  }, [hierarchyFilters, searchEntites, selectedYearId]);

  useEffect(() => {
    if (!authLogin) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedYearId) {
          params.set("yearId", selectedYearId);
        }
        params.set("page", String(page));
        params.set("pageSize", String(PAGE_SIZE));
        if (query.trim()) params.set("q", query.trim());
        if (entiteIds) params.set("entiteIds", entiteIds);
        if (activeTab === "responsables" && roleFilter) params.set("roleId", roleFilter);
        if ((activeTab === "formations" || activeTab === "structures") && typeEntiteFilter) {
          params.set("typeEntite", typeEntiteFilter);
        }
        if (activeTab === "formations" && typeDiplomeFilter) {
          params.set("typeDiplome", typeDiplomeFilter);
        }

        const path = `/search/${activeTab}?${params.toString()}`;
        const data = await apiFetch<PagedResponse<unknown>>(path, { login: authLogin });
        if (!mounted) return;

        setTotal(data.total ?? 0);

        if (activeTab === "responsables") {
          setResponsables(data.items as ApiResponsable[]);
        } else if (activeTab === "formations") {
          setFormations(data.items as ApiFormation[]);
        } else if (activeTab === "structures") {
          setStructures(data.items as ApiStructure[]);
        } else {
          setSecretariats(data.items as ApiStructure[]);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [
    activeTab,
    authLogin,
    entiteIds,
    page,
    query,
    roleFilter,
    selectedYearId,
    typeDiplomeFilter,
    typeEntiteFilter,
  ]);

  const roleOptions = useMemo(
    () =>
      allRoles.map((role) => ({
        id: getRoleId(role),
        label: role.libelle,
      })),
    [allRoles],
  );

  const yearOptions = useMemo(() => {
    if (!canQueryWholeBase) {
      return [];
    }

    return [
      { value: ALL_YEARS_VALUE, label: "Toute la base" },
      ...availableYears.map((year) => ({ value: year.id, label: year.year })),
    ];
  }, [availableYears, canQueryWholeBase]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasActiveFilters = Boolean(
    query.trim() ||
      roleFilter ||
      Object.values(hierarchyFilters).some(Boolean) ||
      typeEntiteFilter ||
      typeDiplomeFilter,
  );

  const resetFilters = () => {
    setQuery("");
    setRoleFilter("");
    setHierarchyFilters(EMPTY_HIERARCHY_FILTERS);
    setTypeEntiteFilter("");
    setTypeDiplomeFilter("");
  };

  const getYearLabel = (yearId: number) => yearLabelById.get(yearId) || String(yearId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-2">Recherche avancee - {yearScopeLabel}</h2>
        <p className="text-slate-600">
          Recherche par onglets : responsables, formations, structures et secretariats.
          {canQueryWholeBase && " Les services centraux peuvent basculer entre une annee precise et toute la base."}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { id: "responsables", label: "Responsables", icon: Users },
            { id: "formations", label: "Formations", icon: GraduationCap },
            { id: "structures", label: "Structures", icon: Building2 },
            { id: "secretariats", label: "Secretariats", icon: Mail },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <FilterBar
          fields={[
            ...(canQueryWholeBase
              ? [
                  {
                    key: "year",
                    label: "Perimetre",
                    type: "select" as const,
                    value: yearFilter,
                    onChange: (value: string) => setYearFilter(value),
                    options: yearOptions,
                  },
                ]
              : []),
            {
              key: "query",
              label: "Recherche",
              type: "search",
              value: query,
              onChange: (value) => setQuery(value),
              placeholder: "Nom, prenom, login, email, ID, code composante...",
            },
            ...HIERARCHY_LEVELS.map((level, index) => {
              const options = hierarchyOptions[level.key];
              return {
                key: level.key,
                label: level.label,
                type: "select" as const,
                value: hierarchyFilters[level.key],
                onChange: (value: string) =>
                  setHierarchyFilters((previous) =>
                    updateHierarchyFilters(previous, level.key, value),
                  ),
                disabled: entitesLoading || options.length === 0,
                options: [
                  { value: "", label: HIERARCHY_EMPTY_LABELS[level.key] },
                  ...options.map((entite) => ({
                    value: String(entite.id_entite),
                    label:
                      entite.type_entite === "COMPOSANTE" && entite.code_composante
                        ? `${entite.nom} (${entite.code_composante})`
                        : entite.nom,
                  })),
                ],
              };
            }),
            ...(activeTab === "responsables"
              ? [
                  {
                    key: "role",
                    label: "Role",
                    type: "select" as const,
                    value: roleFilter,
                    onChange: (value: string) => setRoleFilter(value),
                    options: [
                      { value: "", label: "Tous les roles" },
                      ...roleOptions.map((role) => ({ value: role.id, label: role.label })),
                    ],
                  },
                ]
              : []),
            ...(activeTab === "formations"
              ? [
                  {
                    key: "typeFormation",
                    label: "Type",
                    type: "select" as const,
                    value: typeEntiteFilter,
                    onChange: (value: string) => setTypeEntiteFilter(value),
                    options: [
                      { value: "", label: "Tous les types" },
                      { value: "MENTION", label: "Mention" },
                      { value: "PARCOURS", label: "Parcours" },
                      { value: "NIVEAU", label: "Niveau / Annee" },
                    ],
                  },
                  {
                    key: "typeDiplome",
                    label: "Diplome",
                    type: "select" as const,
                    value: typeDiplomeFilter,
                    onChange: (value: string) => setTypeDiplomeFilter(value),
                    options: [
                      { value: "", label: "Tous les diplomes" },
                      { value: "Licence", label: "Licence" },
                      { value: "Master", label: "Master" },
                      { value: "BUT", label: "BUT" },
                      { value: "Ingenieur", label: "Ingenieur" },
                      { value: "DU", label: "DU" },
                    ],
                  },
                ]
              : []),
            ...(activeTab === "structures"
              ? [
                  {
                    key: "typeStructure",
                    label: "Type",
                    type: "select" as const,
                    value: typeEntiteFilter,
                    onChange: (value: string) => setTypeEntiteFilter(value),
                    options: [
                      { value: "", label: "Tous les types" },
                      { value: "COMPOSANTE", label: "Composante" },
                      { value: "DEPARTEMENT", label: "Departement" },
                      { value: "MENTION", label: "Mention" },
                      { value: "PARCOURS", label: "Parcours" },
                      { value: "NIVEAU", label: "Niveau / Annee" },
                    ],
                  },
                ]
              : []),
          ]}
          hasActiveFilters={hasActiveFilters}
          onReset={resetFilters}
        />

        {entitesLoading && (
          <div className="mt-3 text-xs text-slate-500">
            Chargement du perimetre de recherche...
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        {loading && <div className="text-slate-500">Chargement...</div>}

        {!loading && activeTab === "responsables" && (
          <div className="space-y-3">
            {responsables.length === 0 && <div className="text-slate-500">Aucun resultat</div>}
            {responsables.map((item) => (
              <div key={item.id_affectation} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-slate-900 font-medium">
                      {item.prenom} {item.nom}
                    </div>
                    <div className="text-sm text-indigo-700">{item.role_label}</div>
                    <div className="text-sm text-slate-600">
                      {item.entite_nom || `Entite ${item.id_entite}`} ({item.type_entite || "N/A"})
                    </div>
                    {showWholeBaseResults && (
                      <div className="text-xs text-slate-500 mt-1">{getYearLabel(item.id_annee)}</div>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">{item.email_institutionnel || "-"}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "formations" && (
          <div className="space-y-3">
            {formations.length === 0 && <div className="text-slate-500">Aucun resultat</div>}
            {formations.map((item) => (
              <div key={item.id_entite} className="border border-slate-200 rounded-lg p-4">
                <div className="text-slate-900 font-medium">
                  {item.nom} <span className="text-slate-500 text-sm">({item.type_entite})</span>
                </div>
                {showWholeBaseResults && (
                  <div className="text-xs text-slate-500 mt-1">{getYearLabel(item.id_annee)}</div>
                )}
                <div className="text-sm text-slate-600 mt-1">
                  Responsables:{" "}
                  {item.responsables.length
                    ? item.responsables
                        .map((responsable) =>
                          `${responsable.prenom} ${responsable.nom} (${responsable.role_label})`,
                        )
                        .join(" | ")
                    : "Aucun"}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === "structures" && (
          <div className="space-y-3">
            {structures.length === 0 && <div className="text-slate-500">Aucun resultat</div>}
            {structures.map((item) => {
              const parent = item.id_entite_parent
                ? searchEntites.find((entite) => entite.id_entite === item.id_entite_parent)
                : null;

              return (
                <div key={item.id_entite} className="border border-slate-200 rounded-lg p-4">
                  <div className="text-slate-900 font-medium flex items-baseline gap-2">
                    {item.nom} <span className="text-slate-500 text-sm">({item.type_entite})</span>
                    {(item.code_composante || item.code_interne) && (
                      <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {item.code_composante ?? item.code_interne}
                      </span>
                    )}
                  </div>
                  {showWholeBaseResults && (
                    <div className="text-xs text-slate-500 mt-1">{getYearLabel(item.id_annee)}</div>
                  )}
                  {parent && (
                    <div className="text-xs text-slate-500 mt-1">
                      Rattache a : {parent.nom} ({parent.type_entite})
                    </div>
                  )}
                  {(item.tel_service || item.bureau_service) && (
                    <div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-4">
                      {item.tel_service && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {item.tel_service}
                        </span>
                      )}
                      {item.bureau_service && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {item.bureau_service}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && activeTab === "secretariats" && (
          <div className="space-y-3">
            {secretariats.length === 0 && <div className="text-slate-500">Aucun resultat</div>}
            {secretariats.map((item) => (
              <div key={item.id_entite} className="border border-slate-200 rounded-lg p-4">
                <div className="text-slate-900 font-medium">
                  {item.nom} <span className="text-slate-500 text-sm">({item.type_entite})</span>
                </div>
                {showWholeBaseResults && (
                  <div className="text-xs text-slate-500 mt-1">{getYearLabel(item.id_annee)}</div>
                )}
                <div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {item.tel_service || "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {item.bureau_service || "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <span className="text-sm text-slate-500">
              {total} resultat{total > 1 ? "s" : ""} - page {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Precedent
              </button>
              <button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
