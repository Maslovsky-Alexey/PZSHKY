namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MuteUserProperty : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "isMuted", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "isMuted");
        }
    }
}
