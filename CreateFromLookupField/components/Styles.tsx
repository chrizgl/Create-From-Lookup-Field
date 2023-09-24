import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
    stack: {
        // must be merged with stackHorizontal or stackVertical
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
        height: 'fit-content',
        boxSizing: 'border-box',
        '> *': {
            textOverflow: 'ellipsis',
        },
    },
    stackHorizontal: {
        // overrides for horizontal stack
        flexDirection: 'row',
        marginLeft: '0px',
        '> :not(:last-child)': {
            marginRight: '1px',
        },
    },
    stackVertical: {
        // overrides for vertical stack
        flexDirection: 'column',
        marginLeft: '5px',
        '> :not(:first-child)': {
            marginTop: '10px',
        },
    },
    stackitem: {
        height: 'fit-content',
        width: '100%',
        alignSelf: 'right',
        flexShrink: 1,
    },
    stackitemSliderVertical: {
        alignSelf: 'left',
        marginLeft: '10px',
        flexShrink: 1,
    },
    stackitemBadgeVertical: {
        alignSelf: 'left',
        marginLeft: '5px',
        flexShrink: 1,
    },
    tooltip: {
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
    },
    overflow: {
        color: 'forestgreen',
        scale: 1.5,
    },
    icon: {
        scale: 1.3,
    },
    input: {
        ...shorthands.border('0px', 'solid', tokens.colorNeutralStroke1),
        backgroundColor: '#f5f5f5',
    },
    contentHeader: {
        marginTop: '0',
    },
});
