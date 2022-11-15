import React, { useState, useRef } from "react";
import SortableTree, {
    addNodeUnderParent,
    removeNodeAtPath,
    changeNodeAtPath,
    toggleExpandedForAll
} from "react-sortable-tree";
import "react-sortable-tree/style.css";
import "./Tree.scss";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import "./App.css";
import ModalAdd from "./Modal/ModalAdd";
import ModalUpdate from "./ModalUpdate/ModalUpdate";

export const seed = [
    {
        id: Math.random(),
        title: "BeeOnCode",
        isDirectory: true,
        expanded: true,
        children: [
            { id: Math.random(), title: "UI/UX Design" },
            {
                id: Math.random(),
                title: "Web Development",
                expanded: true,
                children: [
                    {
                        id: Math.random(),
                        title: "Front-end",
                    },
                    {
                        id: Math.random(),
                        title: "Back-end"
                    }
                ]
            }
        ]
    }
];

function Tree() {
    const [searchString, setSearchString] = useState("");
    const [searchFocusIndex, setSearchFocusIndex] = useState(0);
    const [searchFoundCount, setSearchFoundCount] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [treeData, setTreeData] = useState(seed);
    const [openModalAdd, setOpenModalAdd] = useState("");
    const [openModalUpdate, setOpenModalUpdate] = useState("");
    const inputEl = useRef();
    const inputMen = useRef();

    function createNode() {
        const value = inputMen.current.value;

        if (value === "") {
            inputMen.current.focus();
            return;
        }

        let newTree = addNodeUnderParent({
            treeData: treeData,
            parentKey: null,
            expandParent: true,
            getNodeKey,
            newNode: {
                id: Math.random(),
                title: value
            }
        });

        setTreeData(newTree.treeData);

        inputMen.current.value = "";
    }

    function updateNode(rowInfo) {
        const { node, path } = rowInfo;
        const { children } = node;

        const value = inputEl.current.value;

        if (value === "") {
            inputEl.current.focus();
            return;
        }

        let newTree = changeNodeAtPath({
            treeData,
            path,
            getNodeKey,
            newNode: {
                children,
                title: value
            }
        });

        setTreeData(newTree);

        inputEl.current.value = "";

    }

    function addNodeChild(rowInfo) {
        let { path } = rowInfo;

        const value = inputEl.current.value;

        if (value === "") {
            inputEl.current.focus();
            return;
        }

        let newTree = addNodeUnderParent({
            treeData: treeData,
            parentKey: path[path.length - 1],
            expandParent: true,
            getNodeKey,
            newNode: {
                id: Math.random(),
                title: value
            }
        });

        setTreeData(newTree.treeData);

        inputEl.current.value = "";

        setOpenModalAdd("")

    }

    function removeNode(rowInfo) {
        const { path } = rowInfo;
        setTreeData(
            removeNodeAtPath({
                treeData,
                path,
                getNodeKey
            })
        );
    }

    function updateTreeData(treeData) {
        setTreeData(treeData);
    }

    function expand(expanded) {
        setTreeData(
            toggleExpandedForAll({
                treeData,
                expanded
            })
        );
    }

    function expandAll() {
        expand(true);
    }

    function collapseAll() {
        expand(false);
    }

    const selectPrevMatch = () => {
        setSearchFocusIndex(
            searchFocusIndex !== null
                ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
                : searchFoundCount - 1
        );
    };

    const selectNextMatch = () => {
        setSearchFocusIndex(
            searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0
        );
    };

    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
        <div>
            <div className="header">
                <h3>Անսահման Խորությամբ Մենյու</h3>
                <input ref={inputMen} type="text" placeholder="Գրեք անունը" />
                <div className="btnPlaces">
                    <button onClick={createNode} className="create">Ստեղծել Մենյու</button>
                    <button onClick={expandAll} className="show">Ցուցադրել բոլորը</button>
                    <button onClick={collapseAll} className="show">Փակել բոլորը</button>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                    }}
                    className={searchOpen ? "active" : null}
                >
                    <span>{searchFoundCount > 0 ? searchFocusIndex + 1 : 0}/{searchFoundCount || 0}</span>
                    <button
                        type="button"
                        disabled={!searchFoundCount}
                        onClick={selectPrevMatch}
                    >
                        &lt;
                    </button>
                    <button
                        type="submit"
                        disabled={!searchFoundCount}
                        onClick={selectNextMatch}
                    >
                        &gt;
                    </button>
                    <label htmlFor="find-box">
                        <input
                            id="find-box"
                            type="text"
                            placeholder="Որոնում ․․․"
                            value={searchString}
                            onChange={(event) => setSearchString(event.target.value)}
                        />
                        <SearchIcon onClick={()=> setSearchOpen(!searchOpen)}/>
                    </label>
                </form>
            </div>

            <div className="menuPlace">
                <SortableTree
                    treeData={treeData}
                    onChange={(treeData) => updateTreeData(treeData)}
                    searchQuery={searchString}
                    searchFocusOffset={searchFocusIndex}
                    isVirtualized={false}
                    searchFinishCallback={(matches) => {
                        setSearchFoundCount(matches.length);
                        setSearchFocusIndex(
                            matches.length > 0 ? searchFocusIndex % matches.length : 0
                        );
                    }}
                    canDrag={({ node }) => !node.dragDisabled}
                    generateNodeProps={(rowInfo) => ({
                        buttons: [
                            <div className="menuItem">
                                <button
                                    label="ավելացնել ենթամենյու"
                                    onClick={(event) => setOpenModalAdd(rowInfo.node.id)}
                                >
                                    <AddIcon/>
                                </button>
                                <button label="թարմացնել" onClick={(event) => setOpenModalUpdate(rowInfo.node.id)}>
                                    <EditIcon/>
                                </button>
                                <button label="ջնջել" onClick={(event) => removeNode(rowInfo)}>
                                    <HighlightOffIcon/>
                                </button>
                            </div>,
                            openModalAdd === rowInfo.node.id ?
                            <ModalAdd openModalAdd={openModalAdd} setOpenModalAdd={setOpenModalAdd} addNodeChild={addNodeChild} inputEl={inputEl} rowInfo={rowInfo}/> : null,
                            openModalUpdate === rowInfo.node.id ?
                            <ModalUpdate openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} updateNode={updateNode} inputEl={inputEl} rowInfo={rowInfo}/> : null
                        ],
                        style: {
                            height: "50px",
                        }
                    })}
                />
            </div>
        </div>
    );
}

export default Tree;
