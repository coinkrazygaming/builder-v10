import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Eye,
  EyeOff,
  Layers,
  ArrowLeft,
  Settings,
  Download,
  Share,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import { Canvas, type CanvasElement } from "@/components/editor/Canvas";
import { ElementsSidebar } from "@/components/editor/ElementsSidebar";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { getElementByType } from "@/components/editor/BuilderElements";
import { useAppStore } from "@shared/store";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// Mock user for demo
const mockUser = {
  id: "mock-user-id",
  displayName: "John Doe",
  primaryEmail: "john@example.com",
};

export default function Editor() {
  const { projectId, pageId } = useParams();
  const user = mockUser;
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    currentProject,
    currentPage,
    selectedElement,
    isPreviewMode,
    editorScale,
    sidebarCollapsed,
    setCurrentProject,
    setCurrentPage,
    setSelectedElement,
    setIsPreviewMode,
    setEditorScale,
    setSidebarCollapsed,
  } = useAppStore();

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [activeDevice, setActiveDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isLoading, setIsLoading] = useState(true);

  // Load project and page data
  useEffect(() => {
    // Validate required parameters
    if (!projectId || !user?.id) {
      console.log("Missing required parameters for editor:", {
        projectId,
        userId: user?.id,
      });
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    setIsLoading(true);

    // Load project data
    fetch(`/api/projects/${projectId}`, {
      headers: {
        "x-user-id": user.id,
      },
      signal: abortController.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Project API error! status: ${res.status} for project ID: ${projectId}`,
          );
        }
        return res.json();
      })
      .then((project) => {
        if (abortController.signal.aborted) return;
        setCurrentProject(project);

        // Load page data
        const targetPageId = pageId || "home";
        return fetch(`/api/projects/${projectId}/pages/${targetPageId}`, {
          headers: {
            "x-user-id": user.id,
          },
          signal: abortController.signal,
        }).then((res) => {
          if (!res.ok) {
            throw new Error(
              `Page API error! status: ${res.status} for page ID: ${targetPageId} in project: ${projectId}`,
            );
          }
          return res.json();
        });
      })
      .then((page) => {
        if (abortController.signal.aborted) return;
        setCurrentPage(page);

        // Initialize with some sample elements
        setElements([
          {
            id: "header-1",
            type: "heading",
            props: {
              children: "Welcome to My Website",
              level: 1,
            },
            style: {
              fontSize: "48px",
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              marginBottom: "24px",
            },
          },
          {
            id: "text-1",
            type: "text",
            props: {
              children:
                "This is a beautiful website built with our visual editor. You can drag and drop elements to create amazing layouts.",
            },
            style: {
              fontSize: "18px",
              color: "#6b7280",
              textAlign: "center",
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px auto",
            },
          },
          {
            id: "button-1",
            type: "button",
            props: {
              children: "Get Started",
              variant: "primary",
            },
            style: {
              fontSize: "16px",
              padding: "16px 32px",
              backgroundColor: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "block",
              margin: "0 auto",
            },
          },
        ]);

        setIsLoading(false);
      })
      .catch((error) => {
        // Handle AbortError specifically - this is expected during cleanup
        if (error.name === 'AbortError' || abortController.signal.aborted) {
          console.log('Fetch request was aborted during cleanup');
          return;
        }

        // Categorize error types for better debugging
        if (error.message.includes("Project API error")) {
          console.warn(
            "Project not found, using fallback project data:",
            error.message,
          );
        } else if (error.message.includes("Page API error")) {
          console.warn(
            "Page not found, using fallback page data:",
            error.message,
          );
        } else {
          console.error("Unexpected error loading editor data:", error);
        }

        // Fallback to mock data
        setCurrentProject({
          id: projectId || "1",
          name: "My Awesome Website",
          description: "A modern website built with the visual editor",
          domain: "awesome.builder.app",
          customDomain: null,
          status: "draft",
          ownerId: user?.id || "",
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        setCurrentPage({
          id: pageId || "home",
          projectId: projectId || "1",
          name: "Home Page",
          slug: "/",
          title: "Welcome to My Website",
          description: "The homepage of my awesome website",
          content: {},
          status: "draft",
          isHomePage: true,
          seoMetadata: {},
          createdBy: user?.id || "",
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
        });

        setElements([
          {
            id: "header-1",
            type: "heading",
            props: {
              children: "Welcome to My Website",
              level: 1,
            },
            style: {
              fontSize: "48px",
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              marginBottom: "24px",
            },
          },
          {
            id: "text-1",
            type: "text",
            props: {
              children:
                "This is a beautiful website built with our visual editor. You can drag and drop elements to create amazing layouts.",
            },
            style: {
              fontSize: "18px",
              color: "#6b7280",
              textAlign: "center",
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px auto",
            },
          },
          {
            id: "button-1",
            type: "button",
            props: {
              children: "Get Started",
              variant: "primary",
            },
            style: {
              fontSize: "16px",
              padding: "16px 32px",
              backgroundColor: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "block",
              margin: "0 auto",
            },
          },
        ]);

        setIsLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [projectId, pageId, user?.id]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping new elements from sidebar
    if (active.data.current?.type === "sidebar-element") {
      const element = active.data.current.element;
      const newElement: CanvasElement = {
        id: `${element.type}-${Date.now()}`,
        type: element.type,
        props: { ...element.defaultProps },
        style: { ...element.defaultStyle },
        children: element.canHaveChildren ? [] : undefined,
      };

      setElements((prev) => [...prev, newElement]);
    }
  }, []);

  const handleElementsChange = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
  }, []);

  const updateElement = useCallback(
    (elementId: string, updates: Partial<CanvasElement>) => {
      const updateInElements = (elements: CanvasElement[]): CanvasElement[] => {
        return elements.map((el) => {
          if (el.id === elementId) {
            return { ...el, ...updates };
          }
          if (el.children) {
            return { ...el, children: updateInElements(el.children) };
          }
          return el;
        });
      };
      setElements(updateInElements);
    },
    [],
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      const removeFromElements = (
        elements: CanvasElement[],
      ): CanvasElement[] => {
        return elements
          .filter((el) => el.id !== elementId)
          .map((el) => {
            if (el.children) {
              return { ...el, children: removeFromElements(el.children) };
            }
            return el;
          });
      };
      setElements(removeFromElements);
      setSelectedElement(null);
    },
    [setSelectedElement],
  );

  const duplicateElement = useCallback((elementId: string) => {
    const findAndDuplicate = (elements: CanvasElement[]): CanvasElement[] => {
      const result: CanvasElement[] = [];
      for (const el of elements) {
        result.push(el);
        if (el.id === elementId) {
          const duplicate: CanvasElement = {
            ...el,
            id: `${el.type}-${Date.now()}`,
            children: el.children ? [...el.children] : undefined,
          };
          result.push(duplicate);
        }
      }
      return result;
    };
    setElements(findAndDuplicate);
  }, []);

  const getSelectedElementData = useCallback((): CanvasElement | null => {
    const findElement = (elements: CanvasElement[]): CanvasElement | null => {
      for (const el of elements) {
        if (el.id === selectedElement) return el;
        if (el.children) {
          const found = findElement(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    return selectedElement ? findElement(elements) : null;
  }, [selectedElement, elements]);

  const getDeviceWidth = () => {
    switch (activeDevice) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Layers className="w-5 h-5 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Top Toolbar */}
        <header className="bg-white dark:bg-gray-800 border-b flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <div>
              <h1 className="font-semibold">{currentProject?.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentPage?.name}
              </p>
            </div>

            <Badge
              variant={
                currentPage?.status === "published" ? "default" : "secondary"
              }
            >
              {currentPage?.status}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <Button variant="ghost" size="sm" disabled>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Redo className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Device Selection */}
            <div className="flex border rounded-md">
              {[
                { key: "desktop", icon: Monitor },
                { key: "tablet", icon: Tablet },
                { key: "mobile", icon: Smartphone },
              ].map(({ key, icon: Icon }) => (
                <Button
                  key={key}
                  variant={activeDevice === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveDevice(key as any)}
                  className="rounded-none first:rounded-l-md last:rounded-r-md"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setEditorScale(Math.max(0.25, editorScale - 0.25))
                }
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                {Math.round(editorScale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditorScale(Math.min(2, editorScale + 0.25))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview Toggle */}
            <Button
              variant={isPreviewMode ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Exit Preview
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>

            {/* Actions */}
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </header>

        {/* Main Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Elements */}
          {!isPreviewMode && (
            <div
              className={cn(
                "transition-all duration-300",
                sidebarCollapsed ? "w-0" : "w-64",
              )}
            >
              <div className="w-64 h-full border-r bg-white dark:bg-gray-800">
                <ElementsSidebar />
              </div>
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto bg-canvas-background p-8">
              <div
                className="mx-auto transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: getDeviceWidth(),
                  transform: `scale(${editorScale})`,
                  transformOrigin: "top center",
                }}
              >
                <Canvas
                  elements={elements}
                  onElementsChange={handleElementsChange}
                  className="min-h-[600px]"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          {!isPreviewMode && (
            <div className="w-80 h-full border-l bg-white dark:bg-gray-800">
              <PropertiesPanel
                selectedElement={getSelectedElementData()}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDuplicateElement={duplicateElement}
              />
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
