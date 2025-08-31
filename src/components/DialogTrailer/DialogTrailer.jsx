import './DialogTrailer.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function DialogTrailer({ movie, details, handleClose, open }) {
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
        <DialogTitle>Bandes annonces pour <b>{movie.title}</b></DialogTitle>
        <DialogContent>
            <div className='trailer-list'>
                {details?.trailer && details.trailer.map((trailer) => (
                    <a
                    key={trailer.id}
                    className='trailer-link'
                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`}
                    target='_blank'
                    >
                        <span className='trailer-title'>{trailer.name}</span>
                        <span>
                            {new Date(trailer.published_at).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                            })}
                        </span>
                    </a>
                ))
                }
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
    </Dialog>
    );
}

export default DialogTrailer;