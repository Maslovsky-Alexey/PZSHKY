namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Medals : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Medals",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        Description = c.String(),
                        Url = c.String(),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id)
                .Index(t => t.User_Id);    
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Medals", "User_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Medals", new[] { "User_Id" });
            DropTable("dbo.Medals");
        }
    }
}
