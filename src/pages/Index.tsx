import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ServerSidebar from "@/components/chat/ServerSidebar";
import ChannelList from "@/components/chat/ChannelList";
import ChatArea from "@/components/chat/ChatArea";
import MemberList from "@/components/chat/MemberList";
import ProfilePanel from "@/components/chat/ProfilePanel";
import ServerSettings from "@/components/chat/ServerSettings";
import DMConversationList from "@/components/chat/DMConversationList";
import DMChatArea from "@/components/chat/DMChatArea";

const Index = () => {
  const [activeServer, setActiveServer] = useState("home");
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeConversation, setActiveConversation] = useState("1");
  const [showMembers, setShowMembers] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const isDM = activeServer === "dm";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <ServerSidebar activeServer={activeServer} onServerChange={setActiveServer} />
      {isDM ? (
        <>
          <DMConversationList
            activeConversation={activeConversation}
            onConversationChange={setActiveConversation}
          />
          <DMChatArea
            conversationId={activeConversation}
            onOpenProfile={setProfileName}
          />
        </>
      ) : (
        <>
          <ChannelList
            activeChannel={activeChannel}
            onChannelChange={setActiveChannel}
            onOpenSettings={() => setShowSettings(true)}
          />
          <ChatArea
            channel={activeChannel}
            onToggleMembers={() => setShowMembers(!showMembers)}
            showMembers={showMembers}
            onOpenProfile={setProfileName}
          />
          <AnimatePresence>
            {showMembers && !profileName && (
              <MemberList onMemberClick={setProfileName} />
            )}
          </AnimatePresence>
        </>
      )}
      <ProfilePanel name={profileName} onClose={() => setProfileName(null)} />
      <AnimatePresence>
        {showSettings && <ServerSettings onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
