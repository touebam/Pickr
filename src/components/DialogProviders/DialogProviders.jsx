import './DialogProviders.css';
import { Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import "flag-icons/css/flag-icons.min.css";

function DialogProviders({ movie, filteredProviders, handleClose, open }) {
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
        <DialogTitle>Autres disponibilités pour <b>{movie.title}</b></DialogTitle>
        <DialogContent>
            <div className="providers-header">
                <div className="providers-subtitle">{filteredProviders.length} pays disponibles</div>
                
                {filteredProviders.length>0 &&
                    <div className="providers-stats">
                        <div className="stat">
                            <span className="stat-number free-stat">
                                {filteredProviders.filter(p => p.free?.length > 0).length}
                            </span>
                            <span className="stat-label">Pays avec accès gratuit</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number flatrate-stat">
                                {filteredProviders.filter(p => p.flatrate?.length > 0).length}
                            </span>
                            <span className="stat-label">Pays avec abonnement</span>
                        </div>
                    </div>
                }
            </div>

            <div className="providers-table-container">
                {filteredProviders.length>0 &&
                    <table className="providers-table">
                        <thead>
                        <tr>
                            <th className="country-header">Pays</th>
                            <th className="providers-header-cell free-header">Gratuit</th>
                            <th className="providers-header-cell flatrate-header">Abonnement</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProviders.map((provider) => (
                            <tr key={provider.country} className="provider-row">
                            <td className="country-cell">
                                <div>
                                    <span className={`fi fi-${provider.countryCode.toLowerCase()}`} title={provider.country}></span>
                                    <span className="country-code">{provider.countryCode}</span>
                                    <span className="country-name">{provider.country}</span>
                                </div>
                            </td>
                            
                            <td className="providers-cell free-cell">
                                {provider.free?.length > 0 ? (
                                <div className="providers-list">
                                    {provider.free.map((providerEl) => (
                                    <Tooltip 
                                        key={providerEl.provider_id}
                                        title={providerEl.provider_name} 
                                        slotProps={{
                                        popper: {
                                            modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                offset: [0, -10],
                                                },
                                            },
                                            ],
                                        },
                                        }}
                                    >
                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(movie.title + " " + providerEl.provider_name)}`}
                                            target='_blank'
                                        >
                                            <img
                                                className="provider-icon"
                                                src={`https://image.tmdb.org/t/p/original${providerEl.logo_path}`}
                                                alt={providerEl.provider_name}
                                                title={providerEl.provider_name}
                                            />
                                        </a>
                                    </Tooltip>
                                    ))}
                                </div>
                                ) : (
                                <span className="no-providers">Aucun</span>
                                )}
                            </td>

                            <td className="providers-cell flatrate-cell">
                                {provider.flatrate?.length > 0 ? (
                                <div className="providers-list">
                                    {provider.flatrate.map((providerEl) => (
                                    <Tooltip 
                                        key={providerEl.provider_id}
                                        title={providerEl.provider_name} 
                                        slotProps={{
                                        popper: {
                                            modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                offset: [0, -10],
                                                },
                                            },
                                            ],
                                        },
                                        }}
                                    >
                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(movie.title + " " + providerEl.provider_name)}`}
                                            target='_blank'
                                        >
                                            <img
                                                className="provider-icon"
                                                key={providerEl.provider_id}
                                                src={`https://image.tmdb.org/t/p/original${providerEl.logo_path}`}
                                                alt={providerEl.provider_name}
                                                title={providerEl.provider_name}
                                            />
                                        </a>
                                    </Tooltip>
                                    ))}
                                </div>
                                ) : (
                                <span className="no-providers">Aucun</span>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
    </Dialog>
    );
}

export default DialogProviders;