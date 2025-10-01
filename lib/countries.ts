export async function fetchCountries() {
const res = await fetch('https://restcountries.com/v3.1/all');
if (!res.ok) throw new Error('Failed to fetch countries');
const data = await res.json();
// Map to useful shape
return data.map((c: any) => ({
name: c.name.common,
code: c.cca2,
dial: c.idd?.root ? (c.idd.root + (c.idd.suffixes?.[0] ?? '')) : '',
flag: c.flags?.svg ?? c.flags?.png
})).sort((a: any,b:any) => a.name.localeCompare(b.name));
}