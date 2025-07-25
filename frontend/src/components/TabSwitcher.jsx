import React, { useState, useEffect } from "react";
import { Tabs, TabList, Item } from "@adobe/react-spectrum";
import { useNavigate, useLocation } from "react-router-dom";

export function newTab(path, title, element) {
    return { path, title, element };
}

export default function TabSwitcher(props) {
    const { heading, rootpath, tabs = [] } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState(tabs[0].path);

    useEffect(() => {
        if (location.pathname.includes(rootpath)) {
            setSelectedTab(
                (tabs.find(tab => location.pathname.includes(tab.path)) ?? tabs[0]).path
            );
        }
    }, [location.pathname, rootpath, tabs]);

    const handleTabChange = (key) => {
        setSelectedTab(key);
        navigate(`/${rootpath}/${key}`,{replace: 'true'});
    };

    function serveComponentFor(tabPath) {
        return tabs.find(({ path }) => tabPath === path)?.element;
    }

    return (
        <div className="p-4" style={{ marginTop: '80px', backgroundColor: 'white' }}>
            <h1 className="text-2xl font-semibold mb-4">{heading}</h1>

            <Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange}>
                <TabList>
                    {tabs.map(({ path, title }) => <Item key={path}>{title}</Item>)}
                </TabList>
            </Tabs>
            {serveComponentFor(selectedTab)}
        </div>
    );
}
