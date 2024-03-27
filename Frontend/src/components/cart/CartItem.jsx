import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, onDelete }) => {
  return (
    <ListItem>
      <ListItemText
        primary={item.name}
        secondary={`Quantity: ${item.quantity}`}
      />
      <ListItemText primary={`$${item.price * item.quantity}`} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CartItem;
