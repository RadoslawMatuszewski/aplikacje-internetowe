<?php
/** @var $movie ?\App\Model\Movie */
?>

<div class="form-group">
    <label for="film">Film</label>
    <input type="text" id="film" name="movie[film]" value="<?= $movie ? htmlspecialchars($movie->getFilm() ?? '', ENT_QUOTES) : '' ?>">
</div>

<div class="form-group">
    <label for="opis">Opis</label>
    <textarea id="opis" name="movie[opis]"><?= $movie ? htmlspecialchars($movie->getOpis() ?? '', ENT_QUOTES) : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>