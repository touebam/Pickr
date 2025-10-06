import './DialogFavorite.css';
import CardFavorite from "./CardFavorite/CardFavorite";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";

function DialogFavorite({ movies, handleClose, open, countryCode, onToggleFavorite }) {
    const { t } = useTranslation("common");
    return (
    <Dialog 
        className="movie-dialog" 
        open={open} 
        onClose={handleClose}
        maxWidth={false}
        sx={{
            '& .MuiDialog-paper': {
            width: '80%',
            maxWidth: '700px',
            }
        }}
    >
        <DialogTitle className='favorite-dialog-title'>{t("favoriteDialog.title")}</DialogTitle>
        <DialogContent>
            <div className='favorite-list'>
                {movies.map((movie) => (
                    <CardFavorite 
                        key={movie.id} 
                        movie={movie}
                        countryCode={countryCode}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t("favoriteDialog.button.close")}</Button>
        </DialogActions>
    </Dialog>
    );
}

export default DialogFavorite;