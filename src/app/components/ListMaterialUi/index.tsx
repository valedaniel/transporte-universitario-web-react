import React, { ReactNode } from 'react';
import { withStyles, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';

type MyProps = { classes: any, icon: any, primary: string, secondary: string }

class ListMaterialUi extends React.Component<MyProps, any> {
    render(): ReactNode {
        const { classes, icon, primary, secondary } = this.props;
        return (
            <List className={classes.list}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            {icon}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={primary} secondary={secondary} />
                </ListItem>
            </List>
        );
    }
}

const styles: any = {
    list: {
        width: '100%',
        maxWidth: '60%'
    },
}

export default withStyles(styles)(ListMaterialUi)