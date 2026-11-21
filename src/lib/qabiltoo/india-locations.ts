/**
 * India state → city dataset for cascading location dropdowns.
 * Used by registration, filters and any location picker.
 * Cities are the major matrimonial hubs for each state.
 */

export interface StateCities {
  state: string;
  cities: string[];
}

export const INDIA_STATES: StateCities[] = [
  {
    state: "Andhra Pradesh",
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
  },
  {
    state: "Assam",
    cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  },
  {
    state: "Bihar",
    cities: ["Patna", "Gaya", "Bhagalpur", "Darbhanga", "Muzaffarpur"],
  },
  {
    state: "Chhattisgarh",
    cities: ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  },
  {
    state: "Delhi (NCT)",
    cities: ["New Delhi", "Okhla", "Jamia Nagar", "Shaheen Bagh", "Dwarka", "Rohini"],
  },
  {
    state: "Goa",
    cities: ["Panaji", "Margao", "Vasco da Gama"],
  },
  {
    state: "Gujarat",
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Gandhinagar"],
  },
  {
    state: "Haryana",
    cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal"],
  },
  {
    state: "Himachal Pradesh",
    cities: ["Shimla", "Dharamshala", "Solan", "Mandi"],
  },
  {
    state: "Jammu & Kashmir",
    cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  },
  {
    state: "Jharkhand",
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  },
  {
    state: "Karnataka",
    cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  },
  {
    state: "Kerala",
    cities: ["Kochi", "Kozhikode", "Thiruvananthapuram", "Thrissur", "Malappuram", "Kannur"],
  },
  {
    state: "Madhya Pradesh",
    cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  },
  {
    state: "Maharashtra",
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Thane"],
  },
  {
    state: "Odisha",
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  },
  {
    state: "Punjab",
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"],
  },
  {
    state: "Rajasthan",
    cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bharatpur"],
  },
  {
    state: "Tamil Nadu",
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode"],
  },
  {
    state: "Telangana",
    cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  },
  {
    state: "Uttar Pradesh",
    cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Aligarh", "Azamgarh"],
  },
  {
    state: "Uttarakhand",
    cities: ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  },
  {
    state: "West Bengal",
    cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"],
  },
];

export const STATES = INDIA_STATES.map((s) => s.state);

/** Union of every city across all states (for an unscoped city dropdown). */
export const ALL_CITIES: string[] = Array.from(
  new Set(INDIA_STATES.flatMap((s) => s.cities))
).sort();

/** Cities for a given state (empty array when the state is unknown). */
export function citiesForState(state: string): string[] {
  return INDIA_STATES.find((s) => s.state === state)?.cities ?? [];
}

/** Best-effort state lookup for a city name (used to preselect cascading dropdowns). */
export function stateForCity(city: string): string | null {
  const hit = INDIA_STATES.find((s) => s.cities.includes(city));
  return hit?.state ?? null;
}
