type AffectationLabelSource = {
  id_role: string;
  libelle_source?: string | null;
  role?: { libelle?: string | null } | null;
};

export function getAffectationDisplayLabel(
  affectation: AffectationLabelSource,
): string {
  const sourceLabel = affectation.libelle_source?.trim();
  if (sourceLabel) {
    return sourceLabel;
  }

  const roleLabel = affectation.role?.libelle?.trim();
  if (roleLabel) {
    return roleLabel;
  }

  return affectation.id_role;
}
