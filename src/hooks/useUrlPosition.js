import { useSearchParams } from "react-router-dom";

export function useUrlPositon() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return [lat, lng];
}
