import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  SearchField,
  View,
  Flex,
  ActionButton,
  Text,
  Tooltip,
  TooltipTrigger,
  Dialog,
  Heading,
  Content,
  Button,
  ButtonGroup,
  Divider,
  DialogTrigger,
} from "@adobe/react-spectrum";
import Copy from "@spectrum-icons/workflow/Copy";
import FilePDF from "@spectrum-icons/workflow/FilePDF";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Checkbox from "@mui/material/Checkbox";

// Import the libraries for Excel and PDF
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function newActionItem(icon, label, handler = (record) => {}) {
  return {
    menuElement: (
      <>
        {icon} {label}
      </>
    ),
    handler,
  };
}
export function viewActionItem(labelName, handler = (record) => {}) {
  return newActionItem(
    <VisibilityIcon style={{ marginRight: 8 }} />,
    `View ${labelName}`,
    handler
  );
}
function recordAsPopupContent(recordData){
  const {sn, ...record} = recordData;
  return <ul>
    {Object.entries(record).map(([k,v])=>(
      <li key={k}>
        <b>{k}:</b> {v}
      </li>
    ))}
  </ul>;
}
export function usePopupWithActionItem(currActionItem,popupHeading,getPopupContent=null){
  const {menuElement,handler} = currActionItem;
  const [record,setRecord] = useState(null);

  const actionItem = {
    menuElement,
    handler: (record) => {
      setRecord(record);
      handler(record)
    }
  }

  const dialogTrigger = record && (
    <DialogTrigger 
      type={"fullscreen"}
      isOpen={record!=null}  
      onOpenChange={(isOpen)=>isOpen || setRecord(null)}
    >
      <ActionButton isHidden />
      {(handleClose) => record && (
      <Dialog>
        <Heading>{popupHeading}</Heading>
        <Divider />
        <Content>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
            <div style={{padding: "4%", borderColor: "#AAAAAA", borderWidth: "1px", borderRadius: "5px"}}>
              {getPopupContent?.(record,()=>setRecord(null)) ?? recordAsPopupContent(record)}
            </div>
          </div>
        </Content>
        <ButtonGroup>
          <Button onPress={handleClose}>Close</Button>
        </ButtonGroup>
      </Dialog>
    )}
    </DialogTrigger>
  );

  return [actionItem,dialogTrigger];
}
export function addActionItem(labelName, handler = (record) => {}) {
  return newActionItem(
    <AddCircleIcon style={{ marginRight: 8 }} />,
    `View ${labelName}`,
    handler
  );
}
export function editActionItem(handler = (record) => {}) {
  return newActionItem(
    <EditIcon style={{ marginRight: 8 }} />,
    `Edit`,
    handler
  );
}
export function deleteActionItem(handler = (record) => {}) {
  return newActionItem(
    <DeleteIcon style={{ marginRight: 8 }} />,
    `Delete`,
    (record) => {
      if (!window.confirm("Are you sure you want to delete this record?"))
        return;
      handler(record);
    }
  );
}

export default function UnifiedManageTable(props) {
  const {
    dataRecords = null,
    idParser = null,
    dataColumns = [],
    searchFields = [],
    actionItems = [], // [{menuElement: element, handler: (record)=>{...}}]
    filename = "Data", // Default filename
  } = props;

  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false); // State for copy tooltip
  const [visibilityAnchorEl, setVisibilityAnchorEl] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(
    dataColumns.reduce(
      (acc, column) => {
        acc[column.field] = true;
        return acc;
      },
      { sn: true, action: true }
    ) // Ensure "sn" and "action" columns are also visible by default
  );

  if (dataRecords == null) return <div>Loading...</div>;

  function getId(record, index) {
    let id = record.id ?? idParser?.(record, index);
    if (id == null)
      throw new Error(
        "UnifiedManageTable Error - Data record has a null id! Either assign an id or pass a valid idParser."
      );
    return { id };
  }
  //adding s/n to each table row, parse id from record if idParser is given
  const rows = dataRecords.map((record, index) => ({
    ...record,
    sn: index + 1,
    ...getId(record, index),
  }));

  //"sn" and "action" will always be there, should not be passed as dataColumns
  const columns = [
    { field: "sn", headerName: "S/N", width: 100 },
    ...dataColumns,
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "4px",
          }}
        >
          <IconButton onClick={(event) => handleClick(event, params.id)}>
            <MenuOpenIcon style={{ fontSize: 20 }} />
          </IconButton>
        </div>
      ),
    },
  ];

  const searchKey = searchText.toLowerCase();
  const filteredRows = rows.filter(
    (row) =>
      searchKey === "" ||
      searchFields.some((field) => {
        const value = row[field];
        return (
          typeof value === "string" && value.toLowerCase().includes(searchKey)
        );
      })
  );

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(filteredRows.find((record) => record.id === id));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map((col) => col.headerName)],
      body: filteredRows.map((row) => columns.map((col) => row[col.field])),
    });
    doc.save(`${filename}.pdf`);
  };

  const handleVisibilityClick = (event) => {
    setVisibilityAnchorEl(event.currentTarget);
  };

  const handleVisibilityClose = () => {
    setVisibilityAnchorEl(null);
  };

  const handleColumnToggle = (field) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const visibleColumnsList = columns.filter(
    (column) => visibleColumns[column.field]
  );

  // Export to Clipboard function
  const exportToClipboard = () => {
    const rowsToCopy = filteredRows.map((row) =>
      columns.map((col) => row[col.field]).join("\t")
    );
    const headers = columns.map((col) => col.headerName).join("\t");
    const clipboardText = [headers, ...rowsToCopy].join("\n");

    navigator.clipboard
      .writeText(clipboardText)
      .then(() => {
        setShowCopyTooltip(true);
        setTimeout(() => setShowCopyTooltip(false), 2000); // Tooltip disappears after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <View marginBottom="size-200" marginTop="size-200">
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex direction="row" alignItems="center">
            <Text>Filter: </Text>
            <SearchField
              placeholder="Type to filter"
              onSubmit={setSearchText}
              width="size-2200"
              marginStart="size-100"
            />
          </Flex>
          <Flex direction="row" alignItems="center" gap="size-100">
            {/* Action Buttons with Text */}
            <TooltipTrigger isOpen={showCopyTooltip}>
              <ActionButton aria-label="Copy" onPress={exportToClipboard}>
                <Copy />
                <Text>Copy</Text>
              </ActionButton>
              <Tooltip>Copied to clipboard</Tooltip>
            </TooltipTrigger>
            <ActionButton aria-label="Export as Excel" onPress={exportToExcel}>
              <FilePDF />
              <Text>Excel</Text>
            </ActionButton>
            <ActionButton aria-label="Export as PDF" onPress={exportToPDF}>
              <FilePDF />
              <Text>PDF</Text>
            </ActionButton>
            <Flex alignItems="center" direction="row">
              <ActionButton onClick={handleVisibilityClick}>
                <VisibilityIcon />
                <Text> Visibility </Text>
              </ActionButton>
              <Menu
                anchorEl={visibilityAnchorEl}
                open={Boolean(visibilityAnchorEl)}
                onClose={handleVisibilityClose}
              >
                {columns.map((column) => (
                  <MenuItem key={column.field}>
                    <Checkbox
                      checked={visibleColumns[column.field]}
                      onChange={() => handleColumnToggle(column.field)}
                    />
                    {column.headerName}
                  </MenuItem>
                ))}
              </Menu>
            </Flex>
          </Flex>
        </Flex>
      </View>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={filteredRows} columns={visibleColumnsList} />
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {actionItems.map(({ menuElement, handler }, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              handler(selectedRecord);
            }}
          >
            {menuElement}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
