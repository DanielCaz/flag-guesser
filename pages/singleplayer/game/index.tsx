import Image from "next/image";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Country } from "../../../Country";

const SinglePlayerGame = ({ countries }: { countries: Country[] }) => {
  const [country, setCountry]: [Country, Dispatch<SetStateAction<Country>>] =
    useState();
  const [guessedCountry, setGuessedCountry] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showH1, setShowH1] = useState(false);

  const pickCountry = () => {
    const randIndex = Math.floor(Math.random() * (countries.length - 1));
    setCountry(countries[randIndex]);
  };

  useEffect(() => {
    pickCountry();
  }, []);

  const guess = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (guessedCountry.toLowerCase() === country.name.common.toLowerCase()) {
      setGameWon(true);
    } else {
      setIncorrectAttempts(incorrectAttempts + 1);
      setTimeout(() => {
        setShowH1(false);
      }, 3000);
    }
    setGuessedCountry("");
    setShowH1(true);
  };

  const parseLanguages = (): string[] => {
    const rawData = JSON.stringify(country.languages);
    const languages = rawData.substring(1, rawData.length - 2).split(",");
    let out = [];
    languages.forEach((language) => {
      out.push(language.split(":")[1].replaceAll('"', ""));
    });
    return out;
  };

  const resetGame = () => {
    setShowH1(false);
    setIncorrectAttempts(0);
    pickCountry();
    setShowHints(false);
    setGameWon(false);
  };

  return (
    <div className="container py-4 d-flex flex-column">
      {showH1 && (
        <div className="mb-2">
          <h1 className={`text-${gameWon ? "success" : "danger"}`}>
            {gameWon ? "Correct!" : "Incorrect"}
          </h1>
          <button type="button" className="btn btn-info" onClick={resetGame}>
            Play again!
          </button>
        </div>
      )}
      {country && (
        <div className="align-self-center">
          <Image
            src={country.flags.svg}
            alt="flag"
            height={300}
            width={500}
            priority
            className="border rounded p-3"
          />
        </div>
      )}
      <div className="row row-cols-sm-2 row-cols-1 g-3 mt-3">
        <div className="col">
          <div className="d-flex flex-column align-items-start border rounded p-2">
            <p>
              <span className="text-danger">Incorrect attempts:</span>{" "}
              {incorrectAttempts}
            </p>
            {incorrectAttempts >= 3 && (
              <button
                type="button"
                className="btn btn-primary mb-1"
                onClick={() => setShowHints(!showHints)}
                disabled={gameWon}
              >
                {showHints ? "Hide hints" : "Show hints"}
              </button>
            )}
            {showHints && country && (
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Region:</strong> {country.region}
                </li>
                <li className="list-group-item">
                  <strong>Languages:</strong>
                  <ul>
                    {parseLanguages().map((language) => {
                      return <li key={language}>{language}</li>;
                    })}
                  </ul>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="col">
          <form className="border rounded p-2" onSubmit={guess}>
            <label htmlFor="inputCountry" className="form-label">
              Country
            </label>
            <input
              required
              type="text"
              id="inputCountry"
              className="form-control"
              name="Country"
              list="dataListCountries"
              value={guessedCountry}
              onChange={(e) => setGuessedCountry(e.target.value)}
              placeholder={
                incorrectAttempts >= 6
                  ? country.name.common.substring(0, 1)
                  : ""
              }
              disabled={gameWon}
            />
            <input
              type="submit"
              value="Guess"
              className="btn btn-primary mt-4 w-100"
              disabled={gameWon}
            />
            <datalist id="dataListCountries">
              {countries.map((countryItem) => {
                return (
                  <option
                    key={countryItem.cca2}
                    value={countryItem.name.common}
                  />
                );
              })}
            </datalist>
          </form>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  return {
    props: { countries },
  };
};

export default SinglePlayerGame;
