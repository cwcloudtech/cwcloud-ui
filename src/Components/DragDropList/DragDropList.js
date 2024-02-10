import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import MButton from '@mui/material/Button';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import classes from "./DragDropList.module.css"
import GlobalContext from '../../Context/GlobalContext';
import colors from "../../Context/Colors";

const not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1);
}

const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const union = (a, b) => {
    return [...a, ...not(b, a)];
}

const DragDropList = (props) => {
    const context = useContext(GlobalContext);
    const _mode = context.mode;
    const [checked, setChecked] = useState([]);
    const leftChecked = intersection(checked, props.unselectedRoles);
    const rightChecked = intersection(checked, props.selectedRoles);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items) =>
        intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        props.setSelectedRoles(props.selectedRoles.concat(leftChecked));
        props.setUnselectedRoles(not(props.unselectedRoles, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        props.setUnselectedRoles(props.unselectedRoles.concat(rightChecked));
        props.setSelectedRoles(not(props.selectedRoles, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleOnDragEndSelectedRoles = (result) => {
        if (!result.source || !result.destination) return;
        if (result.destination.droppableId === 'Chosen' && result.source.droppableId === "Chosen") {
            const item = Array.from(props.selectedRoles)
            const [reorderItem] = item.splice(result.source.index, 1)
            item.splice(result.destination.index, 0, reorderItem)
            props.setSelectedRoles(item)
        } else if (result.destination.droppableId === 'Choices' && result.source.droppableId === "Choices") {
            const item = Array.from(props.unselectedRoles)
            const [reorderItem] = item.splice(result.source.index, 1)
            item.splice(result.destination.index, 0, reorderItem)
            props.setUnselectedRoles(item)
        }
    }

    const customList = (title, items) => (
        <Card>
            <CardHeader style={{backgroundColor: colors.secondBackground[_mode]}}
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider style={{ backgroundColor: colors.secondText[_mode] }} />
            <DragDropContext onDragEnd={handleOnDragEndSelectedRoles}>
                <Droppable droppableId={title}>
                    {provided => (<List {...provided.droppableProps} ref={provided.innerRef}
                        sx={{
                            width: 400,
                            height: 430,
                            bgcolor: colors.secondBackground[_mode],
                            overflow: 'auto',
                        }}
                        dense
                        component="div"
                        role="list"
                    >
                        {items.map((value, index) => {
                            const labelId = `transfer-list-all-item-${value}-label`;
                            return (
                                <Draggable key={value} draggableId={value} index={index}>
                                    {(provided) => (
                                        <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                                            key={value}
                                            role="listitem"
                                            button
                                            onClick={handleToggle(value)}
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    checked={checked.indexOf(value) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={`${value}`} />
                                            {title === "Chosen" && value !== items[0] && value !== items[items.length - 1] ?
                                                <ListItemIcon className={classes.listIconArrowUpDown}>
                                                    <i className={["fa-solid fa-caret-up", classes.arrowUpDown].join(' ')}></i>
                                                    <i className={["fa-solid fa-caret-down", classes.arrowUpDown].join(' ')}></i>
                                                </ListItemIcon> : title === "Chosen" && value === items[0] ?
                                                    <ListItemIcon className={classes.listIconArrowUpDown}>
                                                        <i className={["fa-solid fa-caret-down", classes.arrowUpDown].join(' ')}></i>
                                                    </ListItemIcon> : title === "Chosen" && value === items[items.length - 1] ?
                                                        <ListItemIcon className={classes.listIconArrowUpDown}>
                                                            <i className={["fa-solid fa-caret-up", classes.arrowUpDown].join(' ')} ></i>
                                                        </ListItemIcon>
                                                        : null
                                            }
                                        </ListItem>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </List>)}
                </Droppable>
            </DragDropContext >
        </Card >
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid xs={5} item>{customList('Choices', props.unselectedRoles)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <MButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        className="blueBtn"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </MButton>
                    <MButton
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        className="blueBtn"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </MButton>
                </Grid>
            </Grid>
            <Grid xs={5} item>{customList('Chosen', props.selectedRoles)}</Grid>
        </Grid>
    );
}

export default DragDropList