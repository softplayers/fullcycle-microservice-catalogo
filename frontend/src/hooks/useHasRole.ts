import { useKeycloak } from "@react-keycloak/web";
import { useMemo } from "react";

export function useHasRealmRole(role: string) {
  // KEYCLOAK OFF
  // const { keycloak, initialized } = useKeycloak(); // ORIGINAL
  const keycloak = { authenticated: true, hasRealmRole: _ => true };
  const initialized = true;
  // KEYCLOAK OFF

  const hasRole = useMemo(() => {
    if (!initialized || !keycloak.authenticated) {
      return false;
    }
    return keycloak.hasRealmRole(role);
  }, [initialized, keycloak, role]);

  return hasRole;
}

export function useHasClient(clientName: string) {
  // KEYCLOAK OFF
  // const { keycloak, initialized } = useKeycloak(); // ORIGINAL
  const keycloak = { authenticated: true };
  const initialized = true;
  // KEYCLOAK OFF

  const hasRole = useMemo(() => {
    if (!initialized || !keycloak.authenticated) {
      return false;
    }

    // KEYCLOAK OFF
    return true;
    /* // ORIGINAL
    const countRoles = keycloak.resourceAccess?.[clientName]?.roles?.length;
    return !countRoles ? false : true;
    */
  }, [initialized, keycloak, clientName]);

  return hasRole;
}
