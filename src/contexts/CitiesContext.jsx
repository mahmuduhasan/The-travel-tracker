import {
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
const CitiesContext = createContext();

const BASE_URL = "https://the-travel-tracker-data.onrender.com";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    default:
      throw new Error("Unknown Action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Data not found");
        }
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There is an error while fetching cities!",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCity.id) return;
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Data not found");
        }
        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There is an error while fetching city!",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Data not found");
      }
      dispatch({ type: "cities/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is an error while creating data!",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({
        type: "cities/deleted",
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There is an error while deleting data!",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext used before initializing CitiesProvider.");
  return context;
}

export { CitiesProvider, useCities };
