import './DialogTrailer.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";

function DialogTrailer({ movie, details, handleClose, open }) {
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
        <DialogTitle>{t("trailerDialog.title")}<b>{movie.title}</b></DialogTitle>
        <DialogContent>
            <div className='trailer-list'>
                {details?.trailers && details.trailers.length > 0 ? 
                    details.trailers.map((trailer) => (
                        <a
                        key={trailer.id}
                        className='trailer-link'
                        href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`}
                        target='_blank'
                        >
                            <span className='trailer-title'>{trailer.name}</span>
                            <span>
                                {new Date(trailer.published_at).toLocaleDateString("fr-FR", {
                                    month: "numeric",
                                    day: "numeric",
                                })}
                                <span className='year'>
                                    /
                                    {new Date(trailer.published_at).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                    })}
                                </span>
                            </span>
                        </a>
                    ))
                    :
                    <div className="providers-subtitle">{t("trailerDialog.empty")}</div>
                }
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{t("trailerDialog.button.close")}</Button>
        </DialogActions>
    </Dialog>
    );
}

export default DialogTrailer;