
export function getPolicyIds(value: string | undefined): string[] {
  if (!value || !value.trim()) return [];
  return value.split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

export function getPoliciesString(ids: string[]): string {
  return ids
    .map(s => (s && String(s).trim()))
    .filter(Boolean)
    .join(',');
}

export function processPolicies(
  procedurePolicies: string | undefined,
  policyOptions: Array<{ id: string; policy_name: string }>
): string {
  if (!procedurePolicies) return '';
  
  if (policyOptions.length > 0) {
    console.log("🔍 [processPolicies] Processing related_policies:", procedurePolicies);
    
    const policyIdentifiers = procedurePolicies.split(',').map(p => p.trim()).filter(Boolean);
    const foundIds: string[] = [];
    
    policyIdentifiers.forEach(identifier => {
      const foundPolicy = policyOptions.find(option => 
        option.policy_name === identifier || 
        option.id === identifier ||
        identifier.includes(option.id)
      );
      
      if (foundPolicy) {
        foundIds.push(foundPolicy.id);
        console.log(`✅ [processPolicies] Found policy: ${identifier} -> ID: ${foundPolicy.id}`);
      } else {
        console.log(`❌ [processPolicies] Policy not found: ${identifier}`);
        foundIds.push(identifier);
      }
    });
    
    const result = foundIds.join(',');
    console.log("🎯 [processPolicies] Final processed policies:", result);
    return result;
  } else {
    console.log("🔄 [processPolicies] Keeping original policies (options not loaded):", procedurePolicies);
    return procedurePolicies;
  }
}
