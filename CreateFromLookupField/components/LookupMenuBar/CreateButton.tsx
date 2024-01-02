import * as React from 'react';
import { useContext } from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button } from '@fluentui/react-components';
import { useStyles } from '../Styles';
import InputActionBarContext from '../CreateFromLookupContext';

type CreateButtonProps = {
    onClickCreateRequest: () => void;
};

const CreateButton: React.FC<CreateButtonProps> = ({ onClickCreateRequest }) => {
    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }
    const createState = contextValue.createState;
    const createEnabledState = contextValue.createEnabledState;

    const classes = useStyles();
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const showCreateButton = () =>
        createState.overlayHidden ? (
            <AddCircle32Regular className={iconClass}></AddCircle32Regular>
        ) : (
            <AddCircle32Filled className={overflowClass}></AddCircle32Filled>
        );

    return <>{createEnabledState && <Button className={classes.stackitem} icon={showCreateButton()} onClick={onClickCreateRequest} />}</>;
};
export default CreateButton;
