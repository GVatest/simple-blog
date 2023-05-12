import { useCallback, useEffect, useState } from "react";
import { IPost } from "models";
import { postsClient } from "services";
import { StyledInput } from "components/shared";

interface SearchProps {
  onSearch: (status: boolean) => void;
  setResults: (results: IPost[]) => void;
  setLoading: (value: boolean) => void;
}

export default function Search({
  onSearch,
  setResults,
  setLoading,
}: SearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) {
      setLoading(true);
      const searchTimeout = setTimeout(() => {
        postsClient
          .search(query)
          .then(({ data }) => {
            setResults(data);
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);

      return () => {
        setLoading(false);
        clearTimeout(searchTimeout);
      };
    }
  }, [query, setLoading, setResults]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchInput = event.target.value.trim();
      if (searchInput) {
        onSearch(true);
        setQuery(searchInput);
      } else {
        setQuery("");
        onSearch(false);
      }
    },
    [onSearch]
  );

  return (
    <div>
      <StyledInput onChange={handleChange} placeholder='Search' type='text' style={{borderRadius: "3rem"}} />
    </div>
  );
}
