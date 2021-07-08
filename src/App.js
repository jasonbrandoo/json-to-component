import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from "reactstrap";

const keysToComponentMap = {
  Row: Row,
  Col: Col,
  Button: Button,
  Form: Form,
  Label: Label,
  Input: Input,
  Select: () => (
    <Input type="select">
      <option disabled selected>
        Pilih
      </option>
      <option>Data</option>
    </Input>
  ),
  Date: () => <Input type="date" />
};

const renderChildren = (children, render) => {
  if (children) {
    if (typeof children === "string") {
      return children;
    }
    return children.map((component) => render(component));
  }
};

const renderer = (config) => {
  if (typeof keysToComponentMap[config.component] !== "undefined") {
    return React.createElement(
      keysToComponentMap[config.component],
      {},
      renderChildren(config.children, (child) => renderer(child))
    );
  }
};

const DynamicForm = ({ data }) => {
  if (data) {
    return data.map((json) => renderer(json));
  }
  return null;
};

const MenuTab = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <Nav tabs>
        {data.map((json) => (
          <NavItem key={json.idForm}>
            <NavLink onClick={() => toggle(json.idForm)}>{json.label}</NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {data.map((json) => (
          <TabPane tabId={json.idForm} key={json.idForm}>
            <DynamicForm data={json.content} />
          </TabPane>
        ))}
      </TabContent>
    </>
  );
};

export default function App() {
  const [jsonComponent, setJsonComponent] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  React.useEffect(() => {
    const get = async () => {
      const res = await fetch("./data.json");
      const json = await res.json();
      setJsonComponent(json.data);
    };

    get();
  }, []);

  return (
    <div className="App">
      <h1>Hello Dynamic</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Nav tabs>
        {jsonComponent.map((json) => (
          <NavItem key={json.idHeader}>
            <NavLink onClick={() => toggle(json.idHeader)}>
              {json.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {jsonComponent.map((json) => (
          <TabPane tabId={json.idHeader} key={json.idHeader}>
            <MenuTab data={json.headerMenu} />
          </TabPane>
        ))}
      </TabContent>
    </div>
  );
}
