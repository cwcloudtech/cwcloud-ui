import React, { useContext } from "react";
import Translate from "react-translate-component";
import GlobalContext from "../../Context/GlobalContext";
import { Tooltip } from '@material-ui/core';
import { Row, Col, Table } from "reactstrap";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GenericTable = ({
  title,
  addNewItem,
  items,
  columns,
  noItemsMessage,
  editItem,
  deleteItem,
  showActions = true,
}) => {
  const context = useContext(GlobalContext);
  const _mode = context.mode;

  return (
    <Row>
      <Col md="12">
        <div style={{ 
          background: _mode === "dark" ? "#2C3139" : "#0861AF", 
          padding: "10px", 
          color: "#fff", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          borderTopLeftRadius: "10px", 
          borderTopRightRadius: "10px"  
        }}>
          <Translate content={title} />
          <Tooltip title={context.counterpart('common.button.add')}>
            <div onClick={addNewItem}>
              <AddIcon className="whiteIcon" />
            </div>
          </Tooltip>
        </div>
        <Table dark={_mode === "dark"} bordered hover>
          <thead className='text-center'>
            <tr>
              <th>#</th>
              {columns.map((column, index) => (
                <th key={index}><Translate content={column.header} /></th>
              ))}
              {showActions && items.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody className='text-center'>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2}>
                  <Translate content={noItemsMessage} />
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{column.accessor(item)}</td>
                  ))}
                  {showActions && (
                    <td>
                      <div style={{ display: 'flex', justifyContent: "center" }}>
                        <div onClick={() => editItem(index)} style={{ marginRight: '5px' }}>
                          <EditIcon className="whiteIcon" />
                        </div>
                        <div onClick={() => deleteItem(index)}>
                          <DeleteIcon className="whiteIcon" />
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default GenericTable;