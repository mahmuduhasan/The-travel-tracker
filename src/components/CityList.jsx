import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./Citylist.module.css";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
function Citylist() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Start adding cities where you have explored before!" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default Citylist;
