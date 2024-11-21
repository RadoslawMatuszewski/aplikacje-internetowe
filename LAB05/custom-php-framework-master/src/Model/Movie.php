<?php
namespace App\Model;

use App\Service\Config;

class Movie
{
    private ?int $id = null;
    private ?string $film = null;
    private ?string $opis = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function setId(?int $id): Movie
    {
        $this->id = $id;
        return $this;
    }

    public function getFilm(): ?string
    {
        return $this->film;
    }

    public function setFilm(?string $film): Movie
    {
        $this->film = $film;
        return $this;
    }

    public function getOpis(): ?string
    {
        return $this->opis;
    }

    public function setOpis(?string $opis): Movie
    {
        $this->opis = $opis;
        return $this;
    }

    public static function fromArray(array $array): Movie
    {
        $movie = new self();
        $movie->fill($array);
        return $movie;
    }

    public function fill(array $array): Movie
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['film'])) {
            $this->setFilm($array['film']);
        }
        if (isset($array['opis'])) {
            $this->setOpis($array['opis']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM movies';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $movies = [];
        $moviesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($moviesArray as $movieArray) {
            $movies[] = self::fromArray($movieArray);
        }

        return $movies;
    }

    public static function find(int $id): ?Movie
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM movies WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $movieArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$movieArray) {
            return null;
        }
        return self::fromArray($movieArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO movies (film, opis) VALUES (:film, :opis)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'film' => $this->getFilm(),
                'opis' => $this->getOpis(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE movies SET film = :film, opis = :opis WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'film' => $this->getFilm(),
                'opis' => $this->getOpis(),
                'id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM movies WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $this->getId()]);
        $this->setId(null);
        $this->setFilm(null);
        $this->setOpis(null);
    }
}
